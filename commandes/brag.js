const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "brag",
  categorie: "Owner",
  reaction: "🔥",
  desc: "Bot flexes about its creator with contact info"
}, async (messageId, chatId, { repondre, ms }) => {
  const bragMessage = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ ⚙️ BOT DEVELOPER INFO
╰━━━━━━━━━━━━━━━━━━━━━━╯
👤 Name: 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥
📞 WhatsApp: +255 681 613 368
🌍 TZ | 🇹🇿
🧠 Focus: WhatsApp Bots • Automation • AI
🛡️ Build: Clean code • Secure • Stable
🎯 Style: Simple. Fast. Reliable.
Not just a bot —
a system built with precision.
━━━━━━━━━━━━━━━━━━━━━━━
⚫ Powered by MR BLACK KILLER
`;

  await chatId.sendMessage(messageId, {
    text: bragMessage
  }, {
    quoted: ms
  });
});
