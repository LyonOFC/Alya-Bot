let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
ㅤ    ꒰  ㅤ 📹 ㅤ *αℓуα - утмр4* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Uѕσ:* ${usedPrefix}${command} <ℓιηк ∂є YouTube>
> ₊· ⫏⫏ ㅤ *Ejeмρℓσ:* ${usedPrefix}${command} https://youtu.be/bX3S-_jUauc

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  if (!text.includes('youtu.be') && !text.includes('youtube.com')) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υяℓ 木 ιηνáℓι∂α ㅤ 性

> ₊· ⫏⫏ ㅤ Eѕσ ησ єѕ υη єηℓα¢є ∂є YouTube

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
  }

  await m.react('📹')
  await m.reply(`
ㅤ    ꒰  ㅤ ⏳ ㅤ *αℓуα - утмр4* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ρяσ¢єѕαη∂σ 木 📥 ㅤ 性

> ₊· ⫏⫏ ㅤ Dєѕ¢αяgαη∂σ νí∂єσ...

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  try {
    const apiUrl = `https://dvlyonn.onrender.com/download/ytvideo?url=${encodeURIComponent(text)}`
    const res = await fetch(apiUrl)
    const data = await res.json()

    if (!data.status || !data.result?.download_url) throw new Error('No se pudo obtener el video')

    const video = data.result
    const duracion = video.duration || 0
    const minutos = Math.floor(duracion / 60)
    const segundos = duracion % 60
    const duracionTexto = `${minutos}:${segundos.toString().padStart(2, '0')}`

    const caption = `
ㅤ    ꒰  ㅤ 📹 ㅤ *αℓуα - утмр4* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ∂єѕ¢αяgα 木 ¢σмρℓєтα ㅤ 性

> ₊· ⫏⫏ ㅤ *τíτυℓσ:* ${video.title || 'Sin título'}
> ₊· ⫏⫏ ㅤ *∂υяα¢ιón:* ${duracionTexto}
> ₊· ⫏⫏ ㅤ *¢αℓι∂α∂:* ${video.quality || '360p'}
> ₊· ⫏⫏ ㅤ *ƒσямαтσ:* ${video.format || 'MP4'}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
> ₊· ⫏⫏ ㅤ 🔖 Cяєα∂σя: Lʏᴏɴɴ
    `.trim()

    if (video.thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption: caption
      }, { quoted: m })
    } else {
      await m.reply(caption)
    }

    await conn.sendMessage(m.chat, {
      video: { url: video.download_url },
      mimetype: 'video/mp4',
      fileName: `${video.title || 'video'}.mp4`
    }, { quoted: m })

    await m.react('✅')
    await m.reply(`
ㅤ    ꒰  ㅤ ✅ ㅤ *αℓуα - утмр4* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єηvíα∂σ 木 🎬 ㅤ 性

> ₊· ⫏⫏ ㅤ *∂isfrυτα тυ νι∂єσ*

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())

  } catch (error) {
    console.error(error)
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ∂єѕ¢αяgα ㅤ 性

> ₊· ⫏⫏ ㅤ *єяяσя:* ${error.message}
> ₊· ⫏⫏ ㅤ Vєяιƒι¢α qυє єℓ єηℓα¢є ѕєα νáℓι∂σ

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
    await m.react('❌')
  }
}

handler.help = ['ytmp4 <link>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'descargarvideo', 'video']

export default handler