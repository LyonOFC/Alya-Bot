import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let pendientes = {}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    const buttons = {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🎵 YTMP3',
        sections: [
          {
            title: '🔗 ENLACE DE YOUTUBE',
            rows: [
              {
                header: '📥 DESCARGA DIRECTA',
                title: '🎵 PEGAR LINK',
                description: 'https://youtu.be/...',
                id: `${usedPrefix}ytmp3 `
              }
            ]
          }
        ]
      })
    }

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'αℓуα - утмρ3', subtitle: 'Youtube a Mp3', hasMediaAttachment: false },
      body: { text: `ㅤ    ꒰ 🎵 *αℓуα - утмρ3* ⫏⫏ ꒱
ㅤ    ⿻ ✿ ιηƒσ 木 αтт 性

> ₊· Uѕσ: *${usedPrefix + command} + link*
> ₊· Eᴊᴇᴍᴘʟᴏ: *${usedPrefix + command} https://youtu.be/M0qv9fTlfdc*` },
      footer: { text: '⫏⫏ αℓуα - вσт ✿' },
      nativeFlowMessage: { buttons: [buttons] }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  await m.react('🎵')

  let url = text.trim()
  if (!url.includes('youtu.be') && !url.includes('youtube.com')) {
    return m.reply(`❌ Link inválido\n\n${usedPrefix + command} https://youtu.be/M0qv9fTlfdc`)
  }

  try {
    // Usar la API que funciona según el ejemplo (sin 'x' en dvlyonn)
    const apiUrl = `https://dvlyonn.onrender.com/download/ytaudio?url=${encodeURIComponent(url)}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.status || !data.result || !data.result.download_url) {
      throw new Error('Error al obtener datos de la API')
    }

    const { title, duration, thumbnail, download_url } = data.result
    const minutos = Math.floor(duration / 60)
    const segundos = duration % 60
    const duracion = `${minutos}:${segundos.toString().padStart(2, '0')}`

    // Guardar pendiente para la descarga posterior
    const chatId = m.chat
    pendientes[chatId] = {
      url: download_url,
      title: title,
      thumbnail: thumbnail
    }

    setTimeout(() => {
      if (pendientes[chatId]) delete pendientes[chatId]
    }, 60000)

    // Preparar miniatura para el mensaje interactivo
    let media = null
    if (thumbnail) {
      const tmpDir = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
      const thumbPath = path.join(tmpDir, `thumb_${Date.now()}.jpg`)
      const thumbRes = await fetch(thumbnail)
      if (thumbRes.ok) {
        const thumbBuffer = await thumbRes.buffer()
        fs.writeFileSync(thumbPath, thumbBuffer)
        media = await conn.prepareWAMessageMedia({ image: fs.readFileSync(thumbPath) }, { upload: conn.waUploadToServer })
        fs.unlinkSync(thumbPath)
      }
    }

    const buttons = {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🎵 DESCARGAR',
        sections: [
          {
            title: '✅ CANCIÓN LISTA',
            rows: [
              {
                header: '📥 TOCA PARA DESCARGAR',
                title: title.substring(0, 35),
                description: `Duración: ${duracion}`,
                id: `desc_${chatId}`
              }
            ]
          }
        ]
      })
    }

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'αℓуα - утмρ3',
        subtitle: 'Youtube a Mp3',
        hasMediaAttachment: !!media,
        imageMessage: media ? media.imageMessage : undefined
      },
      body: {
        text: `ㅤ    ꒰ 🎵 *αℓуα - утмρ3* ⫏⫏ ꒱
ㅤ    ⿻ ✿ ιηƒσ 木 αтт 性

> ₊· *Título:* ${title}
> ₊· *Duración:* ${duracion}
> ₊· *Toca el botón para descargar*`
      },
      footer: { text: '⫏⫏ αℓуα - вσт ✿' },
      nativeFlowMessage: { buttons: [buttons] }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (error) {
    console.error(error)
    m.reply(`❌ Error al procesar el enlace. Verifica que el video exista y sea válido.`)
  }
}

handler.before = async (m, { conn }) => {
  const flow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!flow) return false

  try {
    const data = JSON.parse(flow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('desc_')) return false

    const chatId = id.replace('desc_', '')
    const pending = pendientes[chatId]
    if (!pending) {
      await conn.sendMessage(m.chat, { text: `❌ El enlace expiró. Usa *ytmp3* nuevamente.` }, { quoted: m })
      return true
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, { text: `⏳ *Descargando ${pending.title}...*` }, { quoted: m })

    // Descargar el audio
    const audioRes = await fetch(pending.url)
    if (!audioRes.ok) throw new Error('No se pudo descargar el audio')
    const audioBuffer = await audioRes.buffer()

    // Enviar el audio
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${pending.title}.mp3`
    }, { quoted: m })

    delete pendientes[chatId]
    await m.react('✅')
    return true

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ Error al descargar: ${e.message}` }, { quoted: m })
    await m.react('❌')
    return true
  }
}

handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = ['ytmp3']

export default handler