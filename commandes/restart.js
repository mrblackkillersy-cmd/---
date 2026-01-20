const { zokou } = require("../framework/zokou");

zokou(
  { nomCom: "restart", categorie: "Mods", reaction: "📴" },
  async (dest, zk, com) => {

    const { repondre, superUser } = com;

    if (!superUser) {
      return repondre("❌ This command is for owner only");
    }

    const { exec } = require("child_process");

    repondre("*BLACK KILLER-XMD bot is Restarting...*");

    exec("pm2 restart all");
  }
);
