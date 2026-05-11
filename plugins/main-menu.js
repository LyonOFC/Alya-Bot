import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

const tags = {
  main: 'ρяιη¢ιραℓ',
  group: 'ɢяυρσѕ',
  economy: 'є¢σησму',
  serbot: 'ѕєявσт',
  owner: 'σωηєя'
}

const defaultMenu = {
  before: `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ιηƒσ 木 αтт ㅤ 性

> ₊· нσℓα *.* вιєηνєηι∂σ αℓ мєηυ ∂є *αℓуα ѕυв*
> ₊· υѕυαяισ: %name
> ₊· ηινєℓ: %level
> ₊· єχρ: %exp / %maxexp
> ₊· υѕυαяισѕ: %totalreg

%readmore
`,
  header: '\nㅤ    ꒰  ㅤ ✿ ㅤ *%category* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ 性 ㅤ ѕє¢¢ιση ㅤ ✿',
  body: '> ₊· ⫏⫏ ㅤ %cmd\n> ₊· → %desc',
  footer: '',
  after: `
ㅤ
ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿
ㅤ
ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
`
}

async function descargarYConvertirAudio(url, outputPath) {
  const tmpDir = path.join(process.cwd(), 'tmp')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  const tempPath = path.join(tmpDir, `temp_${Date.now()}.mp3`)
  const res = await fetch(url)
  const buffer = await res.buffer()
  fs.writeFileSync(tempPath, buffer)
  await execPromise(
    `ffmpeg -y -i "${tempPath}" -c:a libopus -b:a 24k -vbr on -compression_level 10 -f ogg "${outputPath}"`
  )
  fs.unlinkSync(tempPath)
  return outputPath
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let user = global.db.data.users[m.sender]

    if (!user.registered) {
      let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
      try {
        let pp = await conn.profilePictureUrl(m.sender, 'image')
        if (pp) fotoPerfil = pp
      } catch (e) {}

      return await conn.sendMessage(m.chat, {
        image: { url: fotoPerfil },
        caption: `
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ яєgιѕтяσ 木 ηє¢єѕαяισ ㅤ ✿

> ₊· ⫏⫏ ㅤ *Debes registrarte primero*
> ₊· ⫏⫏ ㅤ Usa: ${_p}reg Lyonn.14

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
        `.trim()
      }, { quoted: m })
    }

    const { exp, level } = global.db.data.users[m.sender]
    const { min, xp } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        desc: p.desc || 'ѕιη ∂єѕ¢яιρ¢ιση'
      }))

    let bannerFinal = 'https://files.catbox.moe/jg0te7.jpeg'
    let audioURL = 'https://files.catbox.moe/i427hk.mp3'

    const textoMenu = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h =>
            defaultMenu.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
              .replace(/%desc/g, menu.desc)
          ).join('\n')).join('\n')
        return cmds ? [
          defaultMenu.header.replace(/%category/g, tags[tag]),
          cmds,
          defaultMenu.footer
        ].join('\n') : ''
      }).filter(Boolean),
      defaultMenu.after
    ].join('\n')

    const replace = {
      name: name,
      level: level,
      exp: exp - min,
      maxexp: xp,
      totalreg: Object.keys(global.db.data.users).length,
      readmore: readMore,
    }

    const texto = textoMenu.replace(new RegExp(`%(${Object.keys(replace).join('|')})`, 'g'), (_, name) => String(replace[name]))

    // ── Envío del menú con botón de ping ──
    await conn.sendMessage(m.chat, {
      image: { url: bannerFinal },
      caption: texto.trim(),
      mentions: [m.sender],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363407253203904@newsletter",
          newsletterName: "αℓуα - ¢нαηηєℓ",
          serverMessageId: 1
        }
      },
      buttons: [
        {
          buttonId: `${_p}ping`,
          buttonText: { displayText: '🏓 ριηg' },
          type: 1
        }
      ],
      headerType: 4,  // 4 = imagen
      footer: '⫏⫏ αℓуα ѕυв ✿'
    }, { quoted: m })

    // ── Audio ──
    try {
      const audioPath = path.join(process.cwd(), 'tmp', `menu_audio_${Date.now()}.ogg`)
      await descargarYConvertirAudio(audioURL, audioPath)
      const audioBuffer = fs.readFileSync(audioPath)

      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m })

      fs.unlinkSync(audioPath)
    } catch (audioErr) {
      console.error('Error con el audio:', audioErr)
    }

    await m.react('🕸️')

  } catch (e) {
    console.error('Error en el menú:', e)
    await m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['menu', 'menú', 'help', 'ayuda']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)