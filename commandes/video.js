const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "video",
    categorie: "Downloader",
    reaction: "🎬",
    desc: "Download a YouTube video by name"
  },
  async (dest, zk, { repondre, arg, ms }) => {

    const query = arg.join(" ");
    if (!query) {
      return repondre(
        "❌ Please provide the video name.\n\nExample:\n.video Harmonize Single Again"
      );
    }

    try {
      const res = await axios.get(
        `https://vihangayt.me/download?query=${encodeURIComponent(query)}`
      );

      if (!res.data || !res.data.data || !res.data.data.video) {
        return repondre("❌ No video found. Try another title.");
      }

      const videoUrl = res.data.data.video;
      const title = res.data.data.title || "Unknown Title";

      await zk.sendMessage(
        dest,
        {
          video: { url: videoUrl },
          caption:
`🎬 *${title}*

━━━━━━━━━━━━━━━━━━━━━━━
⚡ BLACK KILLER IS ALIVE
💀 NEVER DIE
━━━━━━━━━━━━━━━━━━━━━━━

✨ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 ✓`
        },
        { quoted: ms }
      );

    } catch (e) {
      console.error("Video Error:", e);
      await repondre("❌ Failed to fetch the video. API may be down.");
    }
  }
);
