import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
ㅤ    ꒰  ㅤ 🎵 ㅤ *αℓуα - ρℓαу* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *υѕσ:* ${usedPrefix}${command} <cαnción>
> ₊· ⫏⫏ ㅤ *єjємρℓσ:* ${usedPrefix}${command} Una vaina loca

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  await m.react('🎵')

  try {
    const searchUrl = `https://dvlyonnxz.onrender.com/search/youtube?=${encodeURIComponent(text)`
    const busqueda = await fetch(searchUrl)
    const searchData = await busqueda.json()

    if (!searchData.status || !searchData.result?.length) {
      throw new Error('No se encontraron resultados')
    }

    const resultados = searchData.result.slice(0, 5)

    const rows = resultados.map((video, i) => ({
      header: `🎵 ${video.channel || 'Desconocido'}`,
      title: video.title.substring(0, 35),
      description: `⏱️ ${video.duration || '?'} | 👁️ ${video.views || '?'}`,
      id: `play_${i}_${Buffer.from(video.url).toString('base64')}_${Buffer.from(video.title).toString('base64')}`
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'αℓуα - ρℓαу',
        subtitle: 'Selecciona una canción',
        hasMediaAttachment: false
      },
      body: {
        text: `🎵 *${text}*\n\nSe encontraron ${resultados.length} resultados. Selecciona una:`
      },
      footer: {
        text: '⫏⫏ αℓуα - вσт ✿'
      },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎵 VER RESULTADOS',
            sections: [{
              title: '📋 SELECCIONA UNA CANCIÓN',
              rows: rows
            }]
          })
        }]
      }
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
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 вúsqυє∂α ㅤ 性

> ₊· ⫏⫏ ㅤ *єяяσя:* ${error.message}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
    await m.react('❌')
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const datos = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = datos.id || datos.selectedId || datos.selectedRowId || null
    if (!id || !id.startsWith('play_')) return false

    await m.react('⏳')

    const parts = id.split('_')
    const urlBase64 = parts[2]
    const titleBase64 = parts[3]
    const videoUrl = Buffer.from(urlBase64, 'base64').toString()
    const videoTitle = Buffer.from(titleBase64, 'base64').toString()

    await conn.sendMessage(m.chat, { text: `⏳ Descargando audio: *${videoTitle.substring(0, 40)}*...` }, { quoted: m })

    const downloadUrl = `https://dvlyonnxz.onrender.com/download/ytaudio?url${encodeURIComponent(videoUrl)}`
    const response = await fetch(downloadUrl)
    const data = await response.json()

    if (!data.status || !data.result?.download_url) {
      throw new Error('No se pudo obtener el audio')
    }

    const duracion = data.result.duration || 0
    const minutos = Math.floor(duracion / 60)
    const segundos = duracion % 60
    const duracionTexto = `${minutos}:${segundos.toString().padStart(2, '0')}`

    const caption = `
ㅤ    ꒰  ㅤ 🎵 ㅤ *αℓуα - ρℓαу* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єท αíяє 木 🎧 ㅤ 性

> ₊· ⫏⫏ ㅤ *τíτυℓσ:* ${data.result.title || videoTitle}
> ₊· ⫏⫏ ㅤ *∂υяα¢ιón:* ${duracionTexto}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim()

    const miniatura = data.result.thumbnail
    if (miniatura) {
      await conn.sendMessage(m.chat, {
        image: { url: miniatura },
        caption: caption
      }, { quoted: m })
    } else {
      await m.reply(caption)
    }

    await conn.sendMessage(m.chat, {
      audio: { url: data.result.download_url },
      mimetype: 'audio/mpeg',
      fileName: `${data.result.title || videoTitle}.mp3`
    }, { quoted: m })

    await m.react('✅')
    return true

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ Error: ${e.message}` }, { quoted: m })
    await m.react('❌')
    return true
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = ['play', 'yt', 'ytaudio']

export default handler