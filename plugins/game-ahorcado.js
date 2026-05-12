import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let hangmanGames = {}

const wordsDB = {
  animales: ['perro', 'gato', 'elefante', 'jirafa', 'tigre', 'leon', 'cebra', 'delfin', 'pinguino', 'canguro', 'koala', 'hipopotamo', 'rinoceronte', 'camello', 'llama', 'alpaca', 'ardilla', 'conejo', 'zorro', 'lobo'],
  frutas: ['manzana', 'pera', 'uva', 'sandia', 'melon', 'naranja', 'fresa', 'kiwi', 'mango', 'cereza', 'durazno', 'ciruela', 'higo', 'papaya', 'guayaba', 'frambuesa', 'arandano', 'coco', 'maracuya', 'granada'],
  paises: ['mexico', 'españa', 'argentina', 'colombia', 'peru', 'chile', 'brasil', 'japon', 'francia', 'italia', 'alemania', 'canada', 'australia', 'china', 'india', 'egipto', 'grecia', 'portugal', 'holanda', 'belgica'],
  colores: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'morado', 'naranja', 'rosa', 'gris', 'marron', 'celeste', 'violeta', 'dorado', 'plateado', 'turquesa', 'fucsia', 'beige', 'lavanda', 'mostaza'],
  profesiones: ['medico', 'ingeniero', 'abogado', 'maestro', 'carpintero', 'electricista', 'plomero', 'chef', 'piloto', 'bombero', 'policia', 'enfermero', 'odontologo', 'veterinario', 'arquitecto', 'disenador', 'periodista', 'actor', 'musico', 'escritor'],
  deportes: ['futbol', 'baloncesto', 'tenis', 'natacion', 'beisbol', 'volleyball', 'golf', 'boxeo', 'ciclismo', 'atletismo', 'esgrima', 'judo', 'karate', 'surf', 'skate', 'esqui', 'patinaje', 'remo', 'handball', 'rugby'],
  tecnologia: ['computadora', 'telefono', 'tableta', 'teclado', 'mouse', 'monitor', 'impresora', 'escanner', 'router', 'modem', 'camara', 'microfono', 'audifonos', 'parlantes', 'memoria', 'procesador', 'disco', 'pantalla', 'bateria', 'cargador'],
  musica: ['guitarra', 'piano', 'violin', 'bateria', 'flauta', 'saxofon', 'trompeta', 'arpa', 'acordeon', 'mandolina', 'banjo', 'ukulele', 'armonica', 'xilofono', 'tambor', 'maracas', 'castanuelas', 'organo', 'contrabajo', 'clarinete']
}

const getRandomWord = () => {
  const categories = Object.keys(wordsDB)
  const category = categories[Math.floor(Math.random() * categories.length)]
  const words = wordsDB[category]
  const word = words[Math.floor(Math.random() * words.length)]
  return { word, category }
}

const hangmanDrawings = [
  `┌───┐
│   │
│   
│   
│   
│   
┴─────`,
  `┌───┐
│   │
│   ○
│   
│   
│   
┴─────`,
  `┌───┐
│   │
│   ○
│   │
│   
│   
┴─────`,
  `┌───┐
│   │
│   ○
│  /│
│   
│   
┴─────`,
  `┌───┐
│   │
│   ○
│  /│\\
│   
│   
┴─────`,
  `┌───┐
│   │
│   ○
│  /│\\
│  /
│   
┴─────`,
  `┌───┐
│   │
│   ○
│  /│\\
│  / \\
│   
┴─────`
]

const getAbcButtons = (gameId, usedLetters, word) => {
  const allLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const rows = []
  
  for (let letter of allLetters) {
    if (!usedLetters.includes(letter)) {
      rows.push({
        title: `🔤 ${letter}`,
        description: `Adivinar ${letter}`,
        id: `hang_${gameId}_${letter}`
      })
    }
  }
  
  const sections = []
  for (let i = 0; i < rows.length; i += 12) {
    sections.push({
      title: `Letras ${Math.floor(i/12)+1}`,
      rows: rows.slice(i, i + 12)
    })
  }
  
  return sections
}

const displayWord = (word, guessedLetters) => {
  let display = ''
  for (let char of word.toUpperCase()) {
    if (guessedLetters.includes(char) || char === ' ') {
      display += char + ' '
    } else if (char === 'Ñ') {
      if (guessedLetters.includes('Ñ')) display += 'Ñ '
      else display += '_ '
    } else {
      const normalized = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (guessedLetters.includes(normalized) || guessedLetters.includes(char)) {
        display += char + ' '
      } else {
        display += '_ '
      }
    }
  }
  return display.trim()
}

let handler = async (m, { conn, usedPrefix }) => {
  let isGroup = m.chat.endsWith('@g.us')
  const gameId = m.chat
  
  if (hangmanGames[gameId]) {
    return m.reply(`❌ Ya hay una partida en curso.\nUsa *${usedPrefix}rendirse* para terminarla.`)
  }
  
  const { word, category } = getRandomWord()
  
  hangmanGames[gameId] = {
    word: word.toUpperCase(),
    category: category,
    guessedLetters: [],
    wrongAttempts: 0,
    player: m.sender,
    maxAttempts: 6,
    lastMove: Date.now(),
    timeout: setTimeout(() => {
      if (hangmanGames[gameId]) {
        conn.sendMessage(m.chat, { text: `⏰ Partida cerrada por inactividad (60 segundos)\nLa palabra era: *${hangmanGames[gameId].word}*` })
        delete hangmanGames[gameId]
      }
    }, 60000)
  }
  
  const sections = getAbcButtons(gameId, [], hangmanGames[gameId].word)
  
  const buttons = {
    name: 'single_select',
    buttonParamsJson: JSON.stringify({
      title: '🔤 SELECCIONA UNA LETRA',
      sections: sections
    })
  }
  
  const wordDisplay = displayWord(hangmanGames[gameId].word, [])
  
  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: { title: 'αℓуα - αнσя¢α∂σ', subtitle: 'Adivina la palabra', hasMediaAttachment: false },
    body: { text: `🎮 *AHORCADO*\n\n📁 Categoría: *${category.toUpperCase()}*\n\n${hangmanDrawings[0]}\n\n📝 Palabra:\n${wordDisplay}\n\n❌ Fallos: 0/${hangmanGames[gameId].maxAttempts}\n🔤 Letras usadas: Ninguna` },
    footer: { text: '⫏⫏ αℓуα - вσт ✿' },
    nativeFlowMessage: { buttons: [buttons] }
  })
  
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
  }, { quoted: m })
  
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false
  
  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('hang_')) return false
    
    const parts = id.split('_')
    const gameId = parts[1]
    const letter = parts[2]
    
    const game = hangmanGames[gameId]
    if (!game) {
      await conn.sendMessage(m.chat, { text: `❌ No hay partida activa. Usa *ahorcado* para iniciar una.` }, { quoted: m })
      return true
    }
    
    if (m.sender !== game.player) {
      await conn.sendMessage(m.chat, { text: `❌ Solo el jugador que inició la partida puede jugar.` }, { quoted: m })
      return true
    }
    
    if (game.guessedLetters.includes(letter)) {
      await conn.sendMessage(m.chat, { text: `❌ Ya intentaste la letra *${letter}*` }, { quoted: m })
      return true
    }
    
    clearTimeout(game.timeout)
    
    game.guessedLetters.push(letter)
    game.lastMove = Date.now()
    game.timeout = setTimeout(() => {
      if (hangmanGames[gameId]) {
        conn.sendMessage(gameId, { text: `⏰ Partida cerrada por inactividad (60 segundos)\nLa palabra era: *${game.word}*` })
        delete hangmanGames[gameId]
      }
    }, 60000)
    
    let isCorrect = game.word.includes(letter)
    let gameOver = false
    let message = ''
    
    if (!isCorrect) {
      game.wrongAttempts++
      
      if (game.wrongAttempts >= game.maxAttempts) {
        gameOver = true
        message = `💀 *PERDISTE* 💀\n\n${hangmanDrawings[game.wrongAttempts]}\n\nLa palabra era: *${game.word}*\n\n📁 Categoría: *${game.category.toUpperCase()}*\n\n⫏⫏ αℓуα - вσт ✿`
        delete hangmanGames[gameId]
      }
    }
    
    if (!gameOver) {
      const wordDisplay = displayWord(game.word, game.guessedLetters)
      const hasWon = !wordDisplay.includes('_')
      
      if (hasWon) {
        gameOver = true
        message = `🏆 *FELICIDADES! GANASTE* 🏆\n\n${hangmanDrawings[game.wrongAttempts]}\n\n📝 Palabra: *${game.word}*\n\n📁 Categoría: *${game.category.toUpperCase()}*\n\n❌ Fallos: ${game.wrongAttempts}/${game.maxAttempts}\n\n⫏⫏ αℓуα - вσт ✿`
        delete hangmanGames[gameId]
      }
    }
    
    if (gameOver) {
      await conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363407253203904@newsletter",
            newsletterName: "αℓуα - ¢нαηηєℓ",
            serverMessageId: 1
          }
        }
      }, { quoted: m })
      return true
    }
    
    const usedLettersDisplay = game.guessedLetters.length > 0 ? game.guessedLetters.join(', ') : 'Ninguna'
    const wordDisplay = displayWord(game.word, game.guessedLetters)
    const sections = getAbcButtons(gameId, game.guessedLetters, game.word)
    
    const buttons = {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🔤 SELECCIONA UNA LETRA',
        sections: sections
      })
    }
    
    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'αℓуα - αнσя¢α∂σ', subtitle: 'Adivina la palabra', hasMediaAttachment: false },
      body: { text: `🎮 *AHORCADO*\n\n📁 Categoría: *${game.category.toUpperCase()}*\n\n${hangmanDrawings[game.wrongAttempts]}\n\n📝 Palabra:\n${wordDisplay}\n\n❌ Fallos: ${game.wrongAttempts}/${game.maxAttempts}\n🔤 Letras usadas: ${usedLettersDisplay}` },
      footer: { text: '⫏⫏ αℓуα - вσт ✿' },
      nativeFlowMessage: { buttons: [buttons] }
    })
    
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })
    
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return true
    
  } catch (e) {
    console.error(e)
    return true
  }
}

handler.help = ['ahorcado']
handler.tags = ['game']
handler.command = ['ahorcado', 'hangman']

export default handler