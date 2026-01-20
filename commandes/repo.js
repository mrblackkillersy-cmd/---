Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

zokou(
  { nomCom: "repo", catégorie: "Général", reaction: "💥", nomFichier: __filename },
  async (dest, zk) => {

    const githubRepo = "https://api.github.com/repos/mrblackkillersy-cmd/---";
    const img = "https://files.catbox.moe/rqlfwv.jpg";

    try {
      const response = await fetch(githubRepo);
      const data = await response.json();

      if (!data || data.message) {
        return zk.sendMessage(dest, {
          text: "❌ Repo haijapatikana au GitHub API limit imefika"
        });
      }

      const releaseDate = new Date(data.created_at).toLocaleDateString("en-GB");

      const gitdata = `*Hello WhatsApp user*
This is *𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻*\n

⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷
      💀 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 💀
⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸

╔═════════════════════╗
║ 🔗 REPOSITORY
╠═════════════════════╣
║ 👉 ${data.html_url}
╚═════════════════════╝
╔═════════════════════╗
║ 🌟 STARS
╠═════════════════════╣
║ 👉 ${data.stargazers_count}
╚═════════════════════╝
╔═════════════════════╗
║ 🍴 FORKS
╠═════════════════════╣
║ 👉 ${data.forks_count}
╚═════════════════════╝
╔═════════════════════╗
║ ⌛ RELEASE DATE
╠═════════════════════╣
║ 👉 ${releaseDate}
╚═════════════════════╝
╔═════════════════════╗
║ 🕐 LAST UPDATE
╠═════════════════════╣
║ 👉 ${data.updated_at}
╚═════════════════════╝
╔═════════════════════╗
║ 👨‍💻 OWNER
╠═════════════════════╣
║ 👉 ${data.owner.login}
╚═════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━
🥀 NO ONE IS SPECIAL!
━━━━━━━━━━━━━━━━━━━━━━━
✨ MADE WITH MR BLACK KILLER ✓`;

      await zk.sendMessage(dest, {
        image: { url: img },
        caption: gitdata
      });

    } catch (err) {
      console.log(err);
      zk.sendMessage(dest, { text: "❌ Error fetching GitHub repo" });
    }
  }
);
