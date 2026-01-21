"use strict";
const { zokou, client } = require("../framework/zokou");

// Developer WhatsApp number (must include @s.whatsapp.net)
const DEVELOPER_NUMBER = "255681613368@s.whatsapp.net";

// Trackme command
zokou({
  nomCom: "trackme",
  categorie: "General",
  reaction: "📡",
  desc: "Send usage alert to developer"
}, async (messageId, chatId, { repondre, ms, sender }) => {

  // Get the sender's number safely
  const number = typeof sender === "string" ? sender.replace("@s.whatsapp.net", "") : "Unknown";

  // Get current time
  const time = new Date().toLocaleString();

  // Prepare the alert message for the developer
  const alert = `📢 *Bot Usage Alert*\n` +
                `👤 Number: ${number}\n` +
                `🕒 Time: ${time}\n\n` +
                `✅ Powered by  𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;

  try {
    // Send confirmation message to the user
    await chatId.sendMessage({
      text: "✅ Your usage has been tracked. Thank you!"
    }, { quoted: ms });

    // Send alert to the developer
    await client.sendMessage(DEVELOPER_NUMBER, {
      text: alert
    });

    console.log(`Usage tracked: ${number} at ${time}`);
  } catch (err) {
    console.error("❌ Error sending trackme messages:", err);
  }
});
