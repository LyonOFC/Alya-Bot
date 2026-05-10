let handler = async (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin, text }) => {
  if (!m.isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  if (!isAdmin && !isOwner && !isROwner) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ α∂мιη 木 яєqυєяι∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ Nєcєѕιтαѕ ѕєя α∂мιη

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  if (!isBotAdmin) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ вσт 木 ѕιη α∂мιη ㅤ 性

> ₊· ⫏⫏ ㅤ Eℓ вσт ηє¢єѕιтα ѕєя α∂мιη

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
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
ㅤ    ꒰  ㅤ 📝 ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Uѕσ 1:* Rєѕρση∂є αℓ мєηѕαנє
> ₊· ⫏⫏ ㅤ *Uѕσ 2:* #кι¢к @υѕυαяισ
> ₊· ⫏⫏ ㅤ *Uѕσ 3:* #кι¢к +59177474230

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  // Verificar si el usuario es owner (anti-owner)
  const detectwhat = user.includes('@lid') ? '@lid' : '@s.whatsapp.net'
  const isROwnerTarget = global.owner ? [...global.owner.map(([number]) => number)].map(v => v.replace(/\D/g, "") + detectwhat).includes(user) : false
  const isOwnerTarget = isROwnerTarget || user === conn.user.jid

  if (isOwnerTarget) return m.reply(`
ㅤ    ꒰  ㅤ 🛡️ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ησ 木 ρυє∂єѕ ㅤ 性

> ₊· ⫏⫏ ㅤ Nσ ρυє∂єѕ єχρυℓѕαя αℓ *¢яєα∂σя*

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  let nombre = user.split('@')[0]

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    await m.reply(`
ㅤ    ꒰  ㅤ ☄️ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єχρυℓѕα∂σ 木 🚫 ㅤ 性

> ₊· ⫏⫏ ㅤ *👤 Usuario:* ${nombre}
> ₊· ⫏⫏ ㅤ *⚡ Acción:* Expulsado del grupo

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
  } catch (e) {
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 єχρυℓѕαя ㅤ 性

> ₊· ⫏⫏ ㅤ *єяяσя:* ${e.message}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
  }
}

handler.help = ['kick']
handler.tags = ['group']
handler.command = ['kick', 'expulsar']
handler.group = true

export default handler