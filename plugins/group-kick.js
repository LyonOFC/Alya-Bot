let handler = async (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin, text }) => {
  let isGroup = m.chat.endsWith('@g.us')
  
  if (!isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  if (!isAdmin && !isOwner && !isROwner) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ α∂мιη 木 яєqυєяι∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ Nєcєѕιтαѕ ѕєя α∂мιη
`.trim())

  if (!isBotAdmin) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ вσт 木 ѕιη α∂мιη ㅤ 性

> ₊· ⫏⫏ ㅤ Eℓ вσт ηє¢єѕιтα ѕєя α∂мιη
`.trim())

  let user = null

  if (m.quoted) {
    user = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else if (text) {
    let numeros = text.match(/\d+/g)
    if (numeros) {
      user = numeros[0] + '@s.whatsapp.net'
    }
  }

  if (!user) return m.reply(`
ㅤ    ꒰  ㅤ 📝 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Usa:* #kick @usuario
> ₊· ⫏⫏ ㅤ *Usa:* Responde al mensaje
`.trim())

  const detectwhat = user.includes('@lid') ? '@lid' : '@s.whatsapp.net'
  const isROwnerTarget = global.owner ? [...global.owner.map(([number]) => number)].map(v => v.replace(/\D/g, "") + detectwhat).includes(user) : false
  const isOwnerTarget = isROwnerTarget || user === conn.user.jid

  if (isOwnerTarget) return m.reply(`
ㅤ    ꒰  ㅤ ☄️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ησ 木 ρυє∂єѕ ㅤ 性

> ₊· ⫏⫏ ㅤ Nσ ρυє∂єѕ єχρυℓѕαя αℓ ¢яєα∂σя
`.trim())

  let nombre = user.split('@')[0]

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    await conn.sendMessage(m.chat, {
      text: `
ㅤ    ꒰  ㅤ ☄️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єχρυℓѕα∂σ 木 🚫 ㅤ 性

> ₊· ⫏⫏ ㅤ *Usuari@:* ${nombre}
> ₊· ⫏⫏ ㅤ *Accion:* Expulsad@
      `.trim(),
      mentions: [user],
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
  } catch (e) {
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 єχρυℓѕαя ㅤ 性

> ₊· ⫏⫏ ㅤ *Error:* ${e.message}
    `.trim())
  }
}

handler.help = ['kick']
handler.tags = ['group']
handler.command = ['kick', 'expulsar']
handler.desc = 'ᴇxᴘᴜʟsᴀʀ ᴀ ᴜɴ ᴜsᴜᴀʀɪᴏ'
handler.group = true

export default handler