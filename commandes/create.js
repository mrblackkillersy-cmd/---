const {
  zokou
} = require("../framework/zokou");
const {
  default: axios
} = require("axios");
zokou({
  nomCom: "create",
  reaction: '🎓',
  categorie: "𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 "
}, async (message, sendMessage, { repondre, arg, ms }) => {
  try {
    const response = await fetch("https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc");
    const data = await response.json();
    const imageUrl = data.urls.regular;

    const messageData = {
      image: {
        url: imageUrl
      },
      caption: "*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥*"
    };

    await sendMessage(message, messageData, { quoted: ms });
  } catch (error) {
    console.error("Error fetching wallpaper:", error);
  }
});
