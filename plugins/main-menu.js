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
  fun: 'ƒυη',
  group: 'ɢяυρσѕ',
  downloader: '∂σωηℓσα∂єя',
  search: 'ѕєαя¢н',
  economy: 'є¢σησму',
  game: 'gαмє',
  nsfw: 'ηѕƒω +18',
  tools: 'тσσℓѕ',
  serbot: 'ѕєявσт',
  owner: 'σωηєя',
  sticker: 'ѕтι¢кєяѕ',
  reaction: 'яєα¢тισηѕ',
  register: 'яєgιѕтєя',
  anime: 'αηιмє',
  info: 'ιηƒσ'
}

const defaultMenu = {
  before: `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ιηƒσ 木 αтт ㅤ 性

> ₊· нσℓα *.* вιєηνєηι∂σ αℓ мєηυ ∂є *αℓуα - вσт*
> ⫏⫏   ✿ ¢αηαℓ  ›
> » https://whatsapp.com/channel/0029VbCOTaJ9RZAQPdiZ4J1K
%readmore
`.trimStart(),
  header: '\nㅤ    ꒰  ㅤ ✿ ㅤ *%category* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ 性 ㅤ ѕє¢¢ιση ㅤ ✿',
  body: '> ₊· ⫏⫏ ㅤ %cmd',
  footer: 'ㅤ',
  after: `
ㅤ
ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿
ㅤ
ㅤ    ꒰  ㅤ 🕸️ ㅤ *ᴄʀᴇᴀᴅᴏ ᴘᴏʀ ʟʏᴏɴɴ* ㅤ ⫏⫏  ꒱
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
    const { exp, level } = global.db.data.users[m.sender]
    const { min, xp } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
      }))

    let bannerFinal = 'https://files.catbox.moe/z4qgf1.jpeg'
    let audioURL = 'https://files.catbox.moe/i427hk.mp3'

    const tipo = conn.user.jid === global.conn.user.jid ? 'ρяιη¢ιραℓ' : 'ѕυв вσт'

    const _text = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h =>
            defaultMenu.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
          ).join('\n')).join('\n')
        return cmds ? [defaultMenu.header.replace(/%category/g, tags[tag]), cmds, defaultMenu.footer].join('\n') : ''
      }).filter(Boolean),
      defaultMenu.after
    ].join('\n')

    const replace = {
      name: name,
      level: level,
      exp: exp - min,
      maxexp: xp,
      totalreg: Object.keys(global.db.data.users).length,
      muptime: clockString(process.uptime() * 1000),
      readmore: readMore,
      tipo: tipo,
    }

    const text = _text.replace(new RegExp(`%(${Object.keys(replace).join('|')})`, 'g'), (_, name) => String(replace[name]))

    await conn.sendMessage(m.chat, {
      image: { url: bannerFinal },
      caption: text.trim(),
      mentions: [m.sender],
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

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}