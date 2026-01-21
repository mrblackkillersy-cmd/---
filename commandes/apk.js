const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: ["apk", "app", "playstore"],
    categorie: "Download",
    reaction: "😈"
  },
  async (dest, zk, context) => {

    const { repondre, arg, ms } = context;
    const appName = arg.join(" ").trim();

    // CHECK INPUT
    if (!appName) {
      return repondre(
        "❌ Please provide an app name.\n\nExample:\n.apk whatsapp"
      );
    }

    try {
      // SEARCH APP
      const searchRes = await axios.get(
        `https://bk9.fun/search/apk?q=${encodeURIComponent(appName)}`
      );

      const results = searchRes.data?.BK9 || searchRes.data?.result;

      if (!results || results.length === 0) {
        return repondre("❌ No app found with that name.");
      }

      // GET DOWNLOAD INFO
      const detailRes = await axios.get(
        `https://bk9.fun/download/apk?id=${results[0].id}`
      );

      const appData = detailRes.data?.BK9 || detailRes.data?.result;

      const downloadLink =
        appData?.dllink ||
        appData?.download ||
        appData?.url;

      if (!downloadLink) {
        return repondre("❌ Download link not available for this app.");
      }

      // SEND APK
      await zk.sendMessage(
        dest,
        {
          document: { url: downloadLink },
          mimetype: "application/vnd.android.package-archive",
          fileName: `${appData.name || appName}.apk`,
          caption: "𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻"
        },
        { quoted: ms }
      );

    } catch (error) {
      console.error("APK COMMAND ERROR:", error);
      repondre("❌ APK download failed. Please try again later.");
    }
  }
);
