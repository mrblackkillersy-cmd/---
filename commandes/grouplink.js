const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "grouplink",
  categorie: "Info",
  reaction: "🔗",
  desc: "Get the official group link"
}, async (messageId, chatId, { repondre }) => {
  const link = "https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76";

  await repondre(
    `🔗 *𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻  OFFICIAL GROUP LINK:*\n\n${link}\n\n✅ Done by 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥`
  );
});
