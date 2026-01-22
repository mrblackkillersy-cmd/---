const { zokou } = require("../framework/zokou");
const { getMessagesAndXPByJID, getBottom10Users } = require("../bdd/level");

/* ================= LEVEL SYSTEM ================= */

function get_level_exp(xp) {
    const levelThresholds = [
        { level: 1, xpThreshold: 500 },
        { level: 2, xpThreshold: 1000 },
        { level: 3, xpThreshold: 2000 },
        { level: 4, xpThreshold: 4000 },
        { level: 5, xpThreshold: 7000 },
        { level: 6, xpThreshold: 10000 },
        { level: 7, xpThreshold: 15000 },
        { level: 8, xpThreshold: 20000 },
        { level: 9, xpThreshold: 25000 },
        { level: 10, xpThreshold: 30000 },
        { level: 11, xpThreshold: 35000 },
        { level: 12, xpThreshold: 45000 },
        { level: 13, xpThreshold: 55000 },
        { level: 14, xpThreshold: 65000 },
        { level: 15, xpThreshold: 75000 },
        { level: 16, xpThreshold: 90000 },
        { level: 17, xpThreshold: 105000 },
        { level: 18, xpThreshold: 120000 },
        { level: 19, xpThreshold: 135000 },
        { level: 20, xpThreshold: 150000 },
        { level: 21, xpThreshold: 170000 },
        { level: 22, xpThreshold: 190000 },
        { level: 23, xpThreshold: 210000 },
        { level: 24, xpThreshold: 230000 },
        { level: 25, xpThreshold: 255000 },
        { level: 26, xpThreshold: 270000 },
        { level: 27, xpThreshold: 295000 },
        { level: 28, xpThreshold: 320000 },
        { level: 29, xpThreshold: 345000 },
        { level: 30, xpThreshold: 385000 },
        { level: 31, xpThreshold: 425000 },
        { level: 32, xpThreshold: 465000 },
        { level: 33, xpThreshold: 505000 },
        { level: 34, xpThreshold: 545000 },
        { level: 35, xpThreshold: 590000 },
        { level: 36, xpThreshold: 635000 },
        { level: 37, xpThreshold: 680000 },
        { level: 38, xpThreshold: 725000 },
        { level: 39, xpThreshold: 770000 },
        { level: 40, xpThreshold: 820000 },
        { level: 41, xpThreshold: 870000 },
        { level: 42, xpThreshold: 920000 },
        { level: 43, xpThreshold: 970000 },
        { level: 44, xpThreshold: 1020000 },
        { level: 45, xpThreshold: 1075000 },
        { level: 46, xpThreshold: 1130000 },
        { level: 47, xpThreshold: 1185000 },
        { level: 48, xpThreshold: 1240000 },
        { level: 49, xpThreshold: 1295000 },
        { level: "BLACK-GOD", xpThreshold: 2000000 }
    ];

    let level = 0;
    let exp = xp;
    let xplimit = levelThresholds[0].xpThreshold;

    for (let i = 0; i < levelThresholds.length; i++) {
        if (xp >= levelThresholds[i].xpThreshold) {
            level = levelThresholds[i].level;
            xplimit = levelThresholds[i + 1]?.xpThreshold || "∞";
            exp = xp - levelThresholds[i].xpThreshold;
        } else break;
    }

    return { level, xplimit, exp };
}

module.exports = { get_level_exp };

/* ================= RANK COMMAND ================= */

zokou(
{
    nomCom: "rank",
    categorie: "Fun"
},
async (dest, zk, commandeOptions) => {

    const {
        ms,
        repondre,
        auteurMessage,
        nomAuteurMessage,
        msgRepondu,
        auteurMsgRepondu,
        mybotpic
    } = commandeOptions;

    try {
        let jid = msgRepondu ? auteurMsgRepondu : auteurMessage;
        let rank = await getMessagesAndXPByJID(jid);
        const data = get_level_exp(rank.xp);

        let ppuser;
        try {
            ppuser = await zk.profilePictureUrl(jid, "image");
        } catch {
            ppuser = mybotpic();
        }

        let role;
        if (data.level < 5) role = "Baby Hacker";
        else if (data.level < 10) role = "Script Kiddie";
        else if (data.level < 15) role = "Junior Ninja";
        else if (data.level < 20) role = "Chunin Hacker";
        else if (data.level < 25) role = "Elite Ninja";
        else if (data.level < 30) role = "ANBU Hacker";
        else if (data.level < 35) role = "Dark Operator";
        else if (data.level < 40) role = "Shadow Kage";
        else if (data.level < 45) role = "Cyber Hermit";
        else role = "☠️ BLACK GOD ☠️";

        let msg = `
┏━━━┛ 💀 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 𝚁𝙰𝙽𝙺 💀 ┗━━━┓

👤 *Name:* ${msgRepondu ? `@${jid.split("@")[0]}` : nomAuteurMessage}
⚡ *Level:* ${data.level}
🔥 *EXP:* ${data.exp}/${data.xplimit}
🧬 *Role:* ${role}
💬 *Messages:* ${rank.messages}

┕━✦━┑ ⚔️ BLACK KILLER-XMD ⚔️ ┍━✦━┙`;

        zk.sendMessage(
            dest,
            {
                image: { url: ppuser },
                caption: msg,
                mentions: msgRepondu ? [jid] : []
            },
            { quoted: ms }
        );

    } catch (e) {
        repondre("❌ Error while fetching rank");
    }
});

/* ================= TOPRANK COMMAND ================= */

zokou(
{
    nomCom: "toprank",
    categorie: "Fun"
},
async (dest, zk, commandeOptions) => {

    const { ms, mybotpic } = commandeOptions;
    let topRanks = await getBottom10Users();
    let mentions = [];

    let msg = `┏━━┛ 👑 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 𝚃𝙾𝙿 𝚁𝙰𝙽𝙺 👑 ┗━━┓\n\n`;

    for (const rank of topRanks) {
        const data = get_level_exp(rank.xp);
        mentions.push(rank.jid);

        msg += `⚡ @${rank.jid.split("@")[0]}
🏆 Level: ${data.level}
🔥 EXP: ${rank.xp}
───────────────\n`;
    }

    zk.sendMessage(
        dest,
        {
            image: { url: mybotpic() },
            caption: msg,
            mentions
        },
        { quoted: ms }
    );
});

   
    
