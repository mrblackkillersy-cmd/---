const { zokou } = require("../framework/zokou");

const DEVELOPER_NUMBER = "255681613368";

zokou({
  nomCom: "devpanel",
  categorie: "Owner",
  reaction: "🛠️",
  desc: "Show developer control panel"
}, async (messageId, chatId, { repondre, sender }) => {
  if (!sender.includes(DEVELOPER_NUMBER)) {
    return repondre("❌ Hii command ni ya developer pekee.");
  }

  const panel = `
🛠️ *Developer Control Panel*

👑 Namba: ${DEVELOPER_NUMBER}
📊 Status: Full Authority
📡 Commands: .memberstatus, .william, .audit, .alert
🔔 Notifications: Active
🧠 Branding: 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻  AI

━━━━━━━━━━━━━━━━━━━━━━━
✅ *Powered by 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥*
`;

  await repondre(panel);
});
