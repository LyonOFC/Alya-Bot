import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    const buttons = {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🎵 YT2MP3',
        sections: [
          {
            title: '🔗 DESCARGA DIRECTA',
            rows: [
              {
                title: '📎 ENVIAR LINK',
                description: 'Pega el enlace de YouTube',
                id: `${usedPrefix}play `
              }
            ]
          }
        ]
      })
    }

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'αℓуα - ∂σωηℓσα∂єя', subtitle: 'Youtube a Mp3', hasMediaAttachment: false },
      body: { text: `ㅤ    ꒰ 🎵 *αℓуα - ∂σωηℓσα∂єя* ⫏⫏ ꒱
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

  await m.react('📥')

  let url = text.trim()
  
  if (!url.includes('youtu.be') && !url.includes('youtube.com')) {
    return m.reply(`❌ Link inválido\n\n${usedPrefix + command} https://youtu.be/M0qv9fTlfdc`)
  }

  try {
    const apiUrl = `https://dvlyonnxz.onrender.com/download/ytaudio?url=${encodeURIComponent(url)}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.status || !data.result) throw new Error('Error')

    const { title, download_url } = data.result

    const tmpDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

    const audioPath = path.join(tmpDir, `${Date.now()}.mp3`)

    const audioRes = await fetch(download_url)
    const audioBuffer = await audioRes.buffer()
    fs.writeFileSync(audioPath, audioBuffer)

    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m })

    fs.unlinkSync(audioPath)
    await m.react('✅')

  } catch (error) {
    m.reply(`❌ Error al descargar`)
  }
}

handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = ['play2', 'ytmp3']

export default handler