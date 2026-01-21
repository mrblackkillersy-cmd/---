const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {

    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");

    var coms = {};
    var mode = "public";

    if ((s.MODE).toLowerCase() != "yes") {
        mode = "private";
    }

    cm.map((com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷
       👾 ${s.BOT} 👾
⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸
╔════════════════▣
┊✺┌── ❐ 👑 𝐀𝐃𝐌𝐈𝐍 ❐ ──⊷
╠✤│👉 ${s.OWNER_NAME}
┊✺└────••••────⊷
╚════════════════▣
╔════════════════▣
┊✺┌── ❐ 🔑 𝐏𝐑𝐄𝐅𝐈𝐗 ❐ ──⊷
╠✤│👉 ${s.PREFIXE}
┊✺└────••••────⊷
╚════════════════▣
╔════════════════▣
┊✺┌── ❐ 🤖 𝐁𝐎𝐓 𝐌𝐎𝐃𝐄 ❐ ──⊷
╠✤│👉 ${mode}
┊✺└────••••────⊷
╚════════════════▣
╔════════════════▣
┊✺┌── ❐ 📅 𝐂𝐀𝐋𝐄𝐍𝐃𝐀𝐑 ❐ ──⊷
╠✤│👉 ${date}
┊✺└────••••────⊷
╚════════════════▣
╔════════════════▣
┊✺┌── ❐ 💾 𝐑𝐀𝐌 ❐ ──⊷
╠✤│👉 8 / 132
┊✺└────••••────⊷
╚════════════════▣
╔════════════════▣
┊✺┌── ❐ 🖥️ 𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌 ❐ ──⊷
╠✤│👉 LINUX
┊✺└────••••────⊷
╚════════════════▣
╔════════════════▣
┊✺┌── ❐ 🧩 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 ❐ ──⊷
╠✤│👉 MR BLACK KILLER
┊✺└────••••────⊷
╚════════════════▣
⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷
${readmore}`;

    let menuMsg = `𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 𝙴𝙽𝙹𝙾𝚈\n`;

    for (const cat in coms) {
        menuMsg += `
╔════════════════▣
┊✺┌── ❐ ${cat.toUpperCase()} ❐ ──⊷
`;

        for (const cmd of coms[cat]) {
            menuMsg += `╠✤│➤ ${cmd}\n`;
        }

        menuMsg += `
┊✺└────••••────⊷
╚════════════════▣
`;
    }

    menuMsg += `
> ✨ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥✓ ✨
`;

    var lien = mybotpic();

    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            zk.sendMessage(
                dest,
                {
                    video: { url: lien },
                    caption: infoMsg + menuMsg,
                    footer: "Déveloper : 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥✓",
                    gifPlayback: true
                },
                { quoted: ms }
            );
        } catch (e) {
            console.log("🥵🥵 Menu erreur " + e);
            repondre("🥵🥵 Menu erreur " + e);
        }
    }

    else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            zk.sendMessage(
                dest,
                {
                    image: { url: lien },
                    caption: infoMsg + menuMsg,
                    footer: "Déveloper : 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥✓"
                },
                { quoted: ms }
            );
        } catch (e) {
            console.log("🥵🥵 Menu erreur " + e);
            repondre("🥵🥵 Menu erreur " + e);
        }
    }

    else {
        repondre(infoMsg + menuMsg);
    }

});
