// ============================================
// ⚠️ PROHIBIDO ADAPTAR O MODIFICAR ESTE CÓDIGO
// 👑 CREADOR ORIGINAL: LYONN
// 🤖 BOT: ALYA BOT
// 📅 COPYRIGHT © 2026 - LYONN
// 🔒 TODOS LOS DERECHOS RESERVADOS
// ============================================

import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { fileURLToPath } from 'url'
import { makeWASocket } from '../lib/simple.js'
import fetch from 'node-fetch'

const { exec } = await import('child_process')
const { CONNECTING } = ws

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let rtx = `
ㅤ    ꒰  ㅤ 📱 ㅤ *αℓуα - ѕυв вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ѕ¢αηєα 木 qя ㅤ 性

> ₊· ⫏⫏ ㅤ *📌 CÓMO VINCULARSE:*
> ₊· ⫏⫏ ㅤ 1. Abre WhatsApp > Dispositivos vinculados
> ₊· ⫏⫏ ㅤ 2. Toca "Vincular un dispositivo"
> ₊· ⫏⫏ ㅤ 3. Escanea el código QR que aparece aquí
> ₊· ⫏⫏ ㅤ 4. ⏱️ Tiempo: 45 segundos

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
> ₊· ⫏⫏ ㅤ 🔖 Cяєα∂σя: Lʏᴏɴɴ
`

let rtx2 = `
ㅤ    ꒰  ㅤ 🔐 ㅤ *αℓуα - ѕυв вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ¢ó∂ιgσ 木 ѕє¢яєтσ ㅤ 性

> ₊· ⫏⫏ ㅤ *📌 CÓMO VINCULARSE:*
> ₊· ⫏⫏ ㅤ 1. Abre WhatsApp > Dispositivos vinculados
> ₊· ⫏⫏ ㅤ 2. Toca "Vincular con código de 8 dígitos"
> ₊· ⫏⫏ ㅤ 3. Ingresa el código que aparece aquí

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
> ₊· ⫏⫏ ㅤ 🔖 Cяєα∂σя: Lʏᴏɴɴ
`

const tokensPremium = {
  'DVLYONN': { dias: 365, nombre: '👑 PREMIUM TOTAL' },
  'NAYDELI': { dias: 180, nombre: '🌸 PREMIUM' },
  'RIZAR': { dias: 90, nombre: '👑 PREMIUM' },
  'DANY': { dias: 30, nombre: '💗 PREMIUM' }
}

const maxSubBots = 500

let blackJBOptions = {}

if (!global.conns) global.conns = []

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60)
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' м y ' + seconds + ' s '
}

async function updateSubBotProfilePicture(sock, imageUrl) {
  try {
    const imgRes = await fetch(imageUrl)
    if (imgRes.ok) {
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
      await sock.updateProfilePicture(sock.user.jid, imgBuffer)
      console.log(chalk.bold.green('✅ ғᴏᴛᴏ ᴅᴇʟ sᴜʙ-ʙᴏᴛ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ 🌸'))
      return true
    }
  } catch (e) {
    console.log(chalk.bold.red(`❌ ᴇʀʀᴏʀ ᴀʟ ᴀᴄᴛᴜᴀʟɪᴢᴀʀ ғᴏᴛᴏ: ${e.message}`))
  }
  return false
}

async function updateSubBotName(sock, newName) {
  try {
    await sock.updateProfileName(newName)
    console.log(chalk.bold.green(`✅ Nᴏᴍʙʀᴇ ᴅᴇʟ sᴜʙ-ʙᴏᴛ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴏ: ${newName}`))
    return true
  } catch (e) {
    console.log(chalk.bold.red(`❌ ᴇʀʀᴏʀ ᴀʟ ᴀᴄᴛᴜᴀʟɪᴢᴀʀ ɴᴏᴍʙʀᴇ: ${e.message}`))
  }
  return false
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ∂єѕα¢тινα∂σ 木 тємρσяαℓ ㅤ 性

> ₊· ⫏⫏ ㅤ Cσмαη∂σ ∂єѕα¢тινα∂σ

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
  }

  let userData = global.db.data.users[m.sender]
  let isPremium = userData.premium === true && userData.premiumTime > Date.now()

  let time = global.db.data.users[m.sender].Subs + 120000
  if (!isPremium && (new Date() - global.db.data.users[m.sender].Subs < 120000)) {
    let remaining = time - new Date()
    setTimeout(() => {
      conn.reply(m.chat, `✅ Yα єѕтαѕ ℓιѕтσ ραяα ¢σηє¢тαятє ∂є ηυєνσ`, m)
    }, remaining)
    return conn.reply(m.chat, `
ㅤ    ꒰  ㅤ ⏳ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єѕρєяα 木 тιємρσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Eѕρєяα ${msToTime(remaining)}*
> ₊· ⫏⫏ ㅤ *🎫 Premium:* Usa #code <TOKEN> para saltar espera

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim(), m)
  }

  const subBots = [...new Set(
    global.conns.filter(c =>
      c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED
    ).map(c => c)
  )]

  const subBotsCount = subBots.length
  const limiteSubBots = isPremium ? 20 : 5

  if (subBotsCount >= limiteSubBots) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ℓιмιтє 木 αℓ¢αηzα∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ Líмιтє: ${limiteSubBots} ѕυв-вσтѕ
${!isPremium ? `> ₊· ⫏⫏ ㅤ 🎫 *Premium:* Usa #code <TOKEN> para tener 20` : ''}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split('@')[0]}`
  let pathblackJadiBot = path.join(process.cwd(), 'subBot', id)

  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }

  blackJBOptions.pathblackJadiBot = pathblackJadiBot
  blackJBOptions.m = m
  blackJBOptions.conn = conn
  blackJBOptions.args = args
  blackJBOptions.usedPrefix = usedPrefix
  blackJBOptions.command = command
  blackJBOptions.fromCommand = true

  await alyaJadiBot(blackJBOptions)

  global.db.data.users[m.sender].Subs = new Date() * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code', 'subbot']

export default handler

export async function alyaJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, usedPrefix, command } = options
  
  let esToken = args[0] && tokensPremium[args[0].toUpperCase()]
  
  if (command === 'code' && esToken) {
    let token = args[0].toUpperCase()
    let tiempo = tokensPremium[token].dias * 86400000
    let expiracion = Date.now() + tiempo
    
    let user = global.db.data.users[m.sender]
    user.premium = true
    user.premiumTime = expiracion
    user.premiumToken = token
    
    await conn.sendMessage(m.chat, {
      text: `
ㅤ    ꒰  ㅤ ✅ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ρяємιυм 木 α¢тινα∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ *👤 Usuario:* @${m.sender.split('@')[0]}
> ₊· ⫏⫏ ㅤ *🎫 Token:* ${token}
> ₊· ⫏⫏ ㅤ *🎁 Tipo:* ${tokensPremium[token].nombre}
> ₊· ⫏⫏ ㅤ *📅 Expira:* ${new Date(expiracion).toLocaleDateString()}
> ₊· ⫏⫏ ㅤ *🎉 Beneficios:* Sin cooldown + 20 sub-bots

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
      `.trim(),
      mentions: [m.sender]
    })
    return
  }
  
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  
  const mcode = args[0] && (/--code|code/.test(args[0].trim()))
    ? true
    : args[1] && (/--code|code/.test(args[1].trim()))
      ? true
      : false
  let txtCode, codeBot, txtQR
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  try {
    if (args[0] && args[0] != undefined) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'))
    }
  } catch {
    conn.reply(m.chat, `⚠️ Uѕα ¢σrrє¢тαмєηтє: ${usedPrefix + command}`, m)
    return
  }

  global.conns = global.conns || []

  const { version } = await fetchLatestBaileysVersion()
  const msgRetry = () => { }
  const msgRetryCache = new NodeCache()
  const { state, saveCreds } = await useMultiFileAuthState(pathblackJadiBot)

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetry,
    msgRetryCache,
    browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
    version: version,
    generateHighQualityLinkPreview: false
  }

  let sock = makeWASocket(connectionOptions)
  sock.isInit = false
  let isInit = true

  async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin, qr } = update
    if (isNewLogin) sock.isInit = false
    if (qr && !mcode) {
      if (m?.chat) {
        txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
      } else {
        return
      }
      if (txtQR && txtQR.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
      }
      return
    }
    if (qr && mcode) {
      let secret = await sock.requestPairingCode((m.sender?.split('@')[0]))
      secret = secret.match(/.{1,4}/g)?.join("-")
      txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
      codeBot = await m.reply(secret)
      console.log(secret)
    }
    if (txtCode && txtCode.key) {
      setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
    }
    if (codeBot && codeBot.key) {
      setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
    }

    const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    if (connection === 'close') {
      if (reason === 428 || reason === 408) {
        console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Cσηєχισn (+${path.basename(pathblackJadiBot)}) cєяяα∂α. Rєιηтєηтαη∂σ...\n╰─────────────────────────`))
        await creloadHandler(true).catch(console.error)
      }
      if (reason === 440) {
        console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Cσηєχισn (+${path.basename(pathblackJadiBot)}) яєємρℓαzα∂α.\n╰─────────────────────────`))
        try {
          if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathblackJadiBot)}@s.whatsapp.net`, { text: 'SESIÓN REEMPLAZADA\n\n> VUELVE A CONECTARTE' }, { quoted: m || null }) : ""
        } catch {}
      }
      if (reason == 405 || reason == 401) {
        console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Sєsισn (+${path.basename(pathblackJadiBot)}) cєяяα∂α.\n╰─────────────────────────`))
        try {
          if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathblackJadiBot)}@s.whatsapp.net`, { text: 'SESIÓN INVÁLIDA\n\n> VUELVE A CONECTARTE' }, { quoted: m || null }) : ""
        } catch {}
        fs.rmSync(pathblackJadiBot, { recursive: true, force: true })
      }
      if (reason === 500) {
        console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Cσηєχισn ρєя∂ι∂α (+${path.basename(pathblackJadiBot)})\n╰─────────────────────────`))
        if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathblackJadiBot)}@s.whatsapp.net`, { text: 'CONEXIÓN PERDIDA\n\n> VUELVE A CONECTARTE' }, { quoted: m || null }) : ""
        return creloadHandler(true).catch(console.error)
      }
      if (reason === 515) {
        console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Rєιηιcιαη∂σ (+${path.basename(pathblackJadiBot)}).\n╰─────────────────────────`))
        await creloadHandler(true).catch(console.error)
      }
      if (reason === 403) {
        console.log(chalk.bold.magentaBright(`\n╭─────────────────────────\n│ Sєsισn cєяяα∂α (+${path.basename(pathblackJadiBot)})\n╰─────────────────────────`))
        fs.rmSync(pathblackJadiBot, { recursive: true, force: true })
      }
    }
    if (connection == 'open') {
      let userName = sock.authState.creds.me?.name || 'Anónimo'
      console.log(
        chalk.bold.cyanBright(
          `\n❒────────────【• SUB-BOT •】────────────❒\n│\n│ 🟢 ${userName} (+${path.basename(pathblackJadiBot)}) cσηєcтα∂σ.\n│\n❒────────────【• CONECTADO •】────────────❒`
        )
      )

      await updateSubBotProfilePicture(sock, 'https://files.catbox.moe/z4qgf1.jpeg')
      
      let userPremium = global.db.data.users[m.sender]
      let nombreSubBot = (userPremium && userPremium.premium) ? 'Alya-Pro' : 'Alya-Sub-Bot'
      await updateSubBotName(sock, nombreSubBot)

      sock.isInit = true
      global.conns.push(sock)

      try {
        await sock.groupAcceptInvite('IJjWzYg976PFSXOJ3uJDOM')
      } catch {}

      if (m?.chat)
        await conn.sendMessage(
          m.chat,
          {
            text: args[0]
              ? `@${m.sender.split('@')[0]}, yα єѕтαѕ ¢σηє¢тα∂σ, ℓєуєη∂σ мєηѕαנєѕ єηтяαηтєѕ...`
              : `
ㅤ    ꒰  ㅤ ✅ ㅤ *αℓуα - ѕυв вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ¢σηє¢тα∂σ 木 ✨ ㅤ 性

> ₊· ⫏⫏ ㅤ @${m.sender.split('@')[0]} Yα єяєѕ ραятє ∂є αℓуα
> ₊· ⫏⫏ ㅤ *Nσмвяє:* ${nombreSubBot}
> ₊· ⫏⫏ ㅤ *Fσтσ:* Aℓуα ρяιη¢ιραℓ

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
> ₊· ⫏⫏ ㅤ 🔖 Cяєα∂σя: Lʏᴏɴɴ
            `.trim(),
            mentions: [m.sender]
          },
          { quoted: m }
        )
    }
  }

  setInterval(async () => {
    if (!sock.user) {
      try { sock.ws?.close() } catch { }
      sock.ev.removeAllListeners()
      let i = global.conns.indexOf(sock)
      if (i < 0) return
      delete global.conns[i]
      global.conns.splice(i, 1)
    }
  }, 60000)

  let handler = await import('../handler.js')
  let creloadHandler = async function (restatConn) {
    try {
      const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
      if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) { }
    if (restatConn) {
      const oldChats = sock.chats
      try { sock.ws?.close() } catch { }
      sock.ev.removeAllListeners()
      sock = makeWASocket(connectionOptions, { chats: oldChats })
      isInit = true
    }
    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler)
      sock.ev.off("connection.update", sock.connectionUpdate)
      sock.ev.off('creds.update', sock.credsUpdate)
    }
    sock.handler = handler.handler.bind(sock)
    sock.connectionUpdate = connectionUpdate.bind(sock)
    sock.credsUpdate = saveCreds.bind(sock)
    sock.ev.on("messages.upsert", sock.handler)
    sock.ev.on("connection.update", sock.connectionUpdate)
    sock.ev.on("creds.update", sock.credsUpdate)
    isInit = false
    return true
  }
  creloadHandler(false)
}