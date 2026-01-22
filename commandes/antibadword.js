const { zokou } = require("../framework/zokou");

let antibadwordGroups = new Set();

// Default bad words
let badWords = [
  "qmmk","kmmk","kumamake","fala","chizi","msenge","choko",
  "fuck","shit","bitch","ass","sex","porn","dick","pussy"
];

// =====================
// ENABLE / DISABLE
// =====================
zokou(
  { nomCom: "antibadword", categorie: "Group", reaction: "🚫" },
  async (dest, zk, { repondre, arg, verifGroupe, verifAdmin }) => {

    if (!verifGroupe) return repondre("❌ Group only");
    if (!verifAdmin) return repondre("❌ Admin only");

    if (!arg[0])
      return repondre("Use:\n.antibadword on\n.antibadword off");

    if (arg[0] === "on") {
      antibadwordGroups.add(dest);
      return repondre("✅ *ANTIBADWORD ENABLED*");
    }

    if (arg[0] === "off") {
      antibadwordGroups.delete(dest);
      return repondre("❌ *ANTIBADWORD DISABLED*");
    }
  }
);

// =====================
// ADD BAD WORD
// =====================
zokou(
  { nomCom: "addbadword", categorie: "Group", reaction: "➕" },
  async (dest, zk, { repondre, arg, verifGroupe, verifAdmin }) => {

    if (!verifGroupe) return repondre("❌ Group only");
    if (!verifAdmin) return repondre("❌ Admin only");

    const word = arg.join(" ").toLowerCase();
    if (!word) return repondre("Example:\n.addbadword choko");

    if (badWords.includes(word))
      return repondre("⚠️ Word already exists");

    badWords.push(word);
    repondre(`✅ Bad word added:\n*${word}*`);
  }
);

// =====================
// REMOVE BAD WORD
// =====================
zokou(
  { nomCom: "delbadword", categorie: "Group", reaction: "➖" },
  async (dest, zk, { repondre, arg, verifGroupe, verifAdmin }) => {

    if (!verifGroupe) return repondre("❌ Group only");
    if (!verifAdmin) return repondre("❌ Admin only");

    const word = arg.join(" ").toLowerCase();
    if (!word) return repondre("Example:\n.delbadword choko");

    badWords = badWords.filter(w => w !== word);
    repondre(`❌ Bad word removed:\n*${word}*`);
  }
);

// =====================
// SHOW LIST
// =====================
zokou(
  { nomCom: "badwordlist", categorie: "Group", reaction: "📜" },
  async (dest, zk, { repondre, verifGroupe }) => {

    if (!verifGroupe) return repondre("❌ Group only");

    repondre(
      `🚫 *BAD WORD LIST*\n\n` +
      badWords.map(w => `• ${w}`).join("\n")
    );
  }
);

// =====================
// AUTO DETECTION
// =====================
zokou(
  { nomCom: "__antibadword_listener__" },
  async (dest, zk, { msg, verifGroupe, auteurMessage }) => {

    if (!verifGroupe) return;
    if (!antibadwordGroups.has(dest)) return;

    const text =
      (msg?.conversation ||
       msg?.extendedTextMessage?.text ||
       "").toLowerCase();

    if (!text) return;

    const detected = badWords.some(word => text.includes(word));
    if (!detected) return;

    try {
      // Delete message
      await zk.sendMessage(dest, {
        delete: {
          remoteJid: dest,
          fromMe: false,
          id: msg.key.id,
          participant: auteurMessage
        }
      });

      // Warning
      await zk.sendMessage(dest, {
        text:
`⚠️ *BAD WORD WARNING*

@${auteurMessage.split("@")[0]}
🚫 Respect group rules!

𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`,
        mentions: [auteurMessage]
      });

    } catch (e) {
      console.log("Antibadword error:", e);
    }
  }
);
