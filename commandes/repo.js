Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

zokou(
  { nomCom: "repo", catégorie: "Général", reaction: "💥", nomFichier: __filename },
  async (dest, zk, commandeOptions) => {

    // ⚠️ BADILISHA HAPA KAMA REPO YAKO NI NYINGINE
    const githubRepo = 'https://github.com/mrblackkillersy-cmd/---';
    const img = 'https://files.catbox.moe/rqlfwv.jpg';

    try {
      const response = await fetch(githubRepo);
      const data = await response.json();

      if (!data || data.message) {
        return zk.sendMessage(dest, { text: "❌ Repo haijapatikana au API limit imefika" });
      }

      const repoInfo = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        lastUpdate: data.updated_at,
        owner: data.owner.login,
      };

      const releaseDate = new Date(data.created_at).toLocaleDateString('en-GB');

      const gitdata = `*hellow whatsaap user
this is* *𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻.*\n
⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷
      💀 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 💀
⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸

╔═════════════════════╗
║ 🔗 𝗥𝗘𝗣𝗢𝗦𝗜𝗧𝗢𝗥𝗬
╠═════════════════════╣
║ 👉 ${data.html_url}
╚═════════════════════╝
╔═════════════════════╗
║ 🌟 𝗦𝗧𝗔𝗥𝗦
╠═════════════════════╣
║ 👉 ${repoInfo.stars}
╚═════════════════════╝
╔═════════════════════╗
║ 🍴 𝗙𝗢𝗥𝗞𝗦
╠═════════════════════╣
║ 👉 ${repoInfo.forks}
╚═════════════════════╝
╔═════════════════════╗
║ ⌛ 𝗥𝗘𝗟𝗘𝗔𝗦𝗘 𝗗𝗔𝗧𝗘
╠═════════════════════╣
║ 👉 ${releaseDate}
╚═════════════════════╝
╔═════════════════════╗
║ 🕐 𝗟𝗔𝗦𝗧 𝗨𝗣𝗗𝗔𝗧𝗘
╠═════════════════════╣
║ 👉 ${repoInfo.lastUpdate}
╚═════════════════════╝
╔═════════════════════╗
║ 👨‍💻 𝗢𝗪𝗡𝗘𝗥
╠═════════════════════╣
║ 👉 ${repoInfo.owner}
╚═════════════════════╝
╔═════════════════════╗
║ 🎭 𝗧𝗛𝗘𝗠𝗘
╠═════════════════════╣
║ 👉 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═════════════════════╝
━━━━━━━━━━━━━━━━━━━━━━━
🥀 NO ONE IS SPECIAL!
━━━━━━━━━━━━━━━━━━━━━━━
✨ 𝗠𝗔𝗗𝗘 𝗪𝗜𝗧𝗛 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 ✓`;

      await zk.sendMessage(dest, {
        image: { url: img },
        caption: gitdata
      });

    } catch (error) {
      console.log("Error fetching data:", error);
      zk.sendMessage(dest, { text: "❌ Error fetching repository data" });
    }
  }
);
