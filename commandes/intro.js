const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "intro",
  categorie: "Owner",
  reaction: "🚀",
  desc: "Bot introduction with branding"
}, async (messageId, chatId, { repondre, ms }) => {
  const introMessage = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *BOT INTRO*
╰━━━━━━━━━━━━━━━━━━━━━━╯
Hello!
I’m a smart assistant built for speed, control, and reliability.
⚙️ Smart commands
🎵 Media & text features
🛡️ Secure owner-only access
🎙️ Voice & AI support
Simple. Stable. Effective.
━━━━━━━━━━━━━━━━━━━━━━━
⚫ Powered by MR BLACK KILLER

━━━━━━━━━━━━━━━━━━━━━━━
📅 Today’s vibe: ${new Date().toLocaleDateString()}
Type *.menu* to explore my full command list.
`;

  await chatId.sendMessage(messageId, {
    text: introMessage
  }, {
    quoted: ms
  });
});
