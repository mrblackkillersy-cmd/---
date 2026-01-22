const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const Taphere = more.repeat(4001);

zokou({ nomCom: "about", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault("Africa/Tanzania");
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // NEW STYLE - MR BLACK KILLER EDITION
    let infoMsg = `╔════════════════════╗
║   𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻   ║
╚════════════════════╝

┌──「 👤 USER INFO 」
│ • Name: ${ms.pushName || 'Unknown'}
│ • ID: ${dest.split('@')[0]}
└─────────────

┌──「 🤖 BOT INFO 」
│ • Name: ${s.BOT}
│ • Version: v3.5.0
│ • Prefix: ${s.PREFIXE}
│ • Mode: ${mode}
│ • Owner: ${s.OWNER_NAME}
│ • Status: ✅ Online
└─────────────

┌──「 📊 SYSTEM INFO 」
│ • Platform: ${os.platform()}
│ • Arch: ${os.arch()}
│ • RAM: ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB
│ • Free RAM: ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB
│ • CPU: ${os.cpus()[0].model}
│ • Uptime: ${formatTime(Math.floor(process.uptime()))}
└─────────────

┌──「 📦 BOT STATS 」
│ • Commands: ${cm.length}
│ • Time: ${temps}
│ • Date: ${date}
│ • Ping: ${Date.now() - ms.messageTimestamp * 1000}ms
└─────────────

┌──「 🔧 FEATURES 」
│ • ✅ Auto AI System
│ • ✅ APK Downloader
│ • ✅ Weather Updates
│ • ✅ Encrypt/Decrypt
│ • ✅ Auto Updates
│ • ✅ 24/7 Active
└─────────────

⚡ *MR BLACK KILLER XMD* ⚡
🤖 Powered by: ${s.OWNER_NAME}
🕐 Running since: ${formatTime(process.uptime())}`;

    let menuMsg = `
    
╭─「 🚀 COMMANDS MENU 」
│ 
├─ 🛠️ *GENERAL*
│ ${getCommandsByCategory(coms, 'General')}
│
├─ 🔧 *UTILITIES*
│ ${getCommandsByCategory(coms, 'Utilities')}
│
├─ 🎮 *FUN*
│ ${getCommandsByCategory(coms, 'Fun')}
│
├─ 🎵 *MEDIA*
│ ${getCommandsByCategory(coms, 'Media')}
│
├─ 📱 *DOWNLOADS*
│ ${getCommandsByCategory(coms, 'Downloads')}
│
├─ 🔐 *ADMIN*
│ ${getCommandsByCategory(coms, 'Admin')}
│
╰─────────────────

📌 *TIPS:* Use ${s.PREFIXE}help <command> for more info

────────────────────
💎 *MR BLACK KILLER XMD*
🚀 Advanced WhatsApp Bot
🌐 Version: v3.5.0
────────────────────

> Made with ❤️ by MR BLACK KILLER
> Type ${s.PREFIXE}donate to support us`;

    // Function to format time
    function formatTime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    }

    // Function to get commands by category
    function getCommandsByCategory(coms, category) {
        if (!coms[category]) return 'No commands';
        return coms[category].map(cmd => `• ${s.PREFIXE}${cmd}`).join('\n│ ');
    }

    var lien = mybotpic();

    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            zk.sendMessage(dest, { 
                video: { url: lien }, 
                caption: infoMsg + menuMsg, 
                footer: `⚡ ${s.BOT} - ${s.OWNER_NAME}`,
                gifPlayback: true 
            }, { quoted: ms });
        }
        catch (e) {
            console.log("❌ Menu error: " + e);
            repondre("❌ Menu error: " + e);
        }
    } 
    else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            zk.sendMessage(dest, { 
                image: { url: lien }, 
                caption: infoMsg + menuMsg, 
                footer: `⚡ ${s.BOT} - ${s.OWNER_NAME}`,
                buttons: [
                    { buttonId: `${s.PREFIXE}help`, buttonText: { displayText: '📖 HELP' }, type: 1 },
                    { buttonId: `${s.PREFIXE}donate`, buttonText: { displayText: '💎 DONATE' }, type: 1 },
                    { buttonId: `${s.PREFIXE}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 }
                ]
            }, { quoted: ms });
        }
        catch (e) {
            console.log("❌ Menu error: " + e);
            repondre(infoMsg + menuMsg);
        }
    } 
    else {
        repondre(infoMsg + menuMsg);
    }
});
