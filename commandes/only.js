const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const axios = require('axios');
const cron = require('../bdd/cron');
const hbd = require('../bdd/hentai');
const { exec } = require('child_process');
const moment = require("moment-timezone");

// Set timezone
moment.tz.setDefault("Africa/Tanzania");
const BOT_NAME = "𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 𝗫𝗠𝗗";

// ==================== GROUP MANAGEMENT COMMANDS ====================

zokou({ nomCom: "tagall", categorie: 'Group', reaction: "🏷️" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) { 
        return repondre(`❌ *This command is reserved for groups only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    if (!verifAdmin && !superUser) { 
        return repondre(`⛔ *Command reserved for group administrators*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const mess = arg && arg.length > 0 ? arg.join(' ') : 'No additional message';
    
    let tag = `╭─⊷ *🏷️ 𝗧𝗔𝗚 𝗔𝗟𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦* ⊶
│
├─ *👥 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢*
│   • Group: ${nomGroupe}
│   • Admin: ${nomAuteurMessage}
│   • Message: ${mess}
│   • Members: ${infosGroupe.participants.length}
│
├─ *📢 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 𝗟𝗜𝗦𝗧*
│`;

    const emoji = ['👤', '🌟', '💎', '⚡', '🔥', '🎯', '👑', '💼', '🎩', '🕶️', '💻', '📱', '🎮', '🏆', '🥇'];
    
    let index = 1;
    for (const membre of infosGroupe.participants) {
        const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
        tag += `│   ${index}. ${randomEmoji} @${membre.id.split("@")[0]}\n`;
        index++;
        if (index > 50) {
            tag += `│   ... and ${infosGroupe.participants.length - 50} more members`;
            break;
        }
    }

    tag += `│
╰─⊷ *𝗧𝗔𝗚𝗚𝗜𝗡𝗚 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗪𝗔𝗥𝗡𝗜𝗡𝗚:*
• Please do not spam tag members
• Respect group rules and guidelines
• Use this feature responsibly
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

    await zk.sendMessage(dest, { 
        text: tag, 
        mentions: infosGroupe.participants.map((i) => i.id) 
    }, { quoted: ms });
});

zokou({ nomCom: "link", categorie: 'Group', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre(`❌ *This command is for groups only*\n\n🔐 Powered by: ${BOT_NAME}`);
    };

    try {
        const link = await zk.groupInviteCode(dest);
        const lien = `https://chat.whatsapp.com/${link}`;
        const timestamp = moment().format('HH:mm:ss DD/MM/YYYY');

        const message = `╭─⊷ *🔗 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗩𝗜𝗧𝗘 𝗟𝗜𝗡𝗞* ⊶
│
├─ *👥 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢*
│   • Name: ${nomGroupe}
│   • Requested by: ${nomAuteurMessage}
│   • Generated: ${timestamp}
│
├─ *📎 𝗟𝗜𝗡𝗞*
│   ${lien}
│
├─ *📝 𝗜𝗡𝗩𝗜𝗧𝗘 𝗥𝗨𝗟𝗘𝗦*
│   1. Share with trusted members only
│   2. No spam invitations
│   3. Respect group privacy
│   4. Admin approval required
│
╰─⊷ *𝗘𝗡𝗝𝗢𝗬 𝗬𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

        await repondre(message);
    } catch (error) {
        console.error("Link command error:", error);
        await repondre(`❌ *Failed to generate group link*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "promote", categorie: 'Group', reaction: "⬆️" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const membresGroupe = verifGroupe ? infosGroupe.participants : [];
    
    const memberAdmin = (membresGroupe) => {
        let admin = [];
        for (const m of membresGroupe) {
            if (m.admin) {
                admin.push(m.id);
            }
        }
        return admin;
    };

    const admins = memberAdmin(membresGroupe);
    const isTargetAdmin = admins.includes(auteurMsgRepondu);
    const isSenderAdmin = admins.includes(auteurMessage) || superUser;
    const isBotAdmin = admins.includes(idBot);

    try {
        if (!isSenderAdmin) {
            return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!msgRepondu) {
            return repondre(`👤 *Please mention the member to promote*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!isBotAdmin) {
            return repondre(`🤖 *Bot needs admin rights to perform this action*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        const targetExists = membresGroupe.some(m => m.id === auteurMsgRepondu);
        if (!targetExists) {
            return repondre(`❌ *User is not in this group*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (isTargetAdmin) {
            return repondre(`⚠️ *User is already an administrator*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
        
        const successMsg = `╭─⊷ *⬆️ 𝗣𝗥𝗢𝗠𝗢𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟* ⊶
│
├─ *🎯 𝗔𝗖𝗧𝗜𝗢𝗡*
│   • User: @${auteurMsgRepondu.split("@")[0]}
│   • Status: Promoted to Admin
│   • By: ${commandeOptions.nomAuteurMessage}
│   • Time: ${moment().format('HH:mm:ss')}
│
╰─⊷ *𝗡𝗘𝗪 𝗣𝗥𝗜𝗩𝗜𝗟𝗘𝗚𝗘𝗦 𝗚𝗥𝗔𝗡𝗧𝗘𝗗* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await zk.sendMessage(dest, { 
            text: successMsg, 
            mentions: [auteurMsgRepondu] 
        });
    } catch (error) {
        console.error("Promote error:", error);
        await repondre(`❌ *Failed to promote user*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "demote", categorie: 'Group', reaction: "⬇️" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const membresGroupe = verifGroupe ? infosGroupe.participants : [];
    
    const memberAdmin = (membresGroupe) => {
        let admin = [];
        for (const m of membresGroupe) {
            if (m.admin) {
                admin.push(m.id);
            }
        }
        return admin;
    };

    const admins = memberAdmin(membresGroupe);
    const isTargetAdmin = admins.includes(auteurMsgRepondu);
    const isSenderAdmin = admins.includes(auteurMessage) || superUser;
    const isBotAdmin = admins.includes(idBot);

    try {
        if (!isSenderAdmin) {
            return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!msgRepondu) {
            return repondre(`👤 *Please mention the admin to demote*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!isBotAdmin) {
            return repondre(`🤖 *Bot needs admin rights to perform this action*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        const targetExists = membresGroupe.some(m => m.id === auteurMsgRepondu);
        if (!targetExists) {
            return repondre(`❌ *User is not in this group*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!isTargetAdmin) {
            return repondre(`⚠️ *User is not an administrator*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
        
        const successMsg = `╭─⊷ *⬇️ 𝗗𝗘𝗠𝗢𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟* ⊶
│
├─ *🎯 𝗔𝗖𝗧𝗜𝗢𝗡*
│   • User: @${auteurMsgRepondu.split("@")[0]}
│   • Status: Removed as Admin
│   • By: ${commandeOptions.nomAuteurMessage}
│   • Time: ${moment().format('HH:mm:ss')}
│
╰─⊷ *𝗔𝗗𝗠𝗜𝗡 𝗣𝗥𝗜𝗩𝗜𝗟𝗘𝗚𝗘𝗦 𝗥𝗘𝗩𝗢𝗞𝗘𝗗* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await zk.sendMessage(dest, { 
            text: successMsg, 
            mentions: [auteurMsgRepondu] 
        });
    } catch (error) {
        console.error("Demote error:", error);
        await repondre(`❌ *Failed to demote user*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "remove", categorie: 'Group', reaction: "🚫" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const membresGroupe = verifGroupe ? infosGroupe.participants : [];
    
    const memberAdmin = (membresGroupe) => {
        let admin = [];
        for (const m of membresGroupe) {
            if (m.admin) {
                admin.push(m.id);
            }
        }
        return admin;
    };

    const admins = memberAdmin(membresGroupe);
    const isTargetAdmin = admins.includes(auteurMsgRepondu);
    const isSenderAdmin = admins.includes(auteurMessage) || superUser;
    const isBotAdmin = admins.includes(idBot);

    try {
        if (!isSenderAdmin) {
            return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!msgRepondu) {
            return repondre(`👤 *Please mention the member to remove*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!isBotAdmin) {
            return repondre(`🤖 *Bot needs admin rights to perform this action*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        const targetExists = membresGroupe.some(m => m.id === auteurMsgRepondu);
        if (!targetExists) {
            return repondre(`❌ *User is not in this group*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (isTargetAdmin) {
            return repondre(`⚠️ *Cannot remove group administrators*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
        
        const successMsg = `╭─⊷ *🚫 𝗠𝗘𝗠𝗕𝗘𝗥 𝗥𝗘𝗠𝗢𝗩𝗘𝗗* ⊶
│
├─ *🎯 𝗔𝗖𝗧𝗜𝗢𝗡*
│   • User: @${auteurMsgRepondu.split("@")[0]}
│   • Status: Removed from group
│   • By: ${nomAuteurMessage}
│   • Time: ${moment().format('HH:mm:ss')}
│   • Date: ${moment().format('DD/MM/YYYY')}
│
╰─⊷ *𝗚𝗥𝗢𝗨𝗣 𝗔𝗖𝗧𝗜𝗢𝗡 𝗟𝗢𝗚𝗚𝗘𝗗* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗪𝗔𝗥𝗡𝗜𝗡𝗚:*
Group administrators have the right to remove members
who violate group rules. Please respect community
guidelines and maintain a positive environment.
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

        await zk.sendMessage(dest, { 
            text: successMsg, 
            mentions: [auteurMsgRepondu] 
        });
    } catch (error) {
        console.error("Remove error:", error);
        await repondre(`❌ *Failed to remove user*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "del", categorie: 'Group', reaction: "🗑️" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe, auteurMsgRepondu, idBot, msgRepondu, verifAdmin, superUser } = commandeOptions;
    
    if (!msgRepondu) {
        return repondre(`❌ *Please mention the message to delete*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (superUser && auteurMsgRepondu === idBot) {
        if (auteurMsgRepondu === idBot) {
            const key = {
                remoteJid: dest,
                fromMe: true,
                id: ms.message.extendedTextMessage.contextInfo.stanzaId,
            };
            await zk.sendMessage(dest, { delete: key });
            return;
        }
    }

    if (verifGroupe) {
        if (verifAdmin || superUser) {
            try {
                const key = {
                    remoteJid: dest,
                    id: ms.message.extendedTextMessage.contextInfo.stanzaId,
                    fromMe: false,
                    participant: ms.message.extendedTextMessage.contextInfo.participant
                };
                await zk.sendMessage(dest, { delete: key });
            } catch (e) {
                await repondre(`❌ *I need admin rights to delete messages*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else {
            await repondre(`⛔ *You are not a group administrator*\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    }
});

zokou({ nomCom: "info", categorie: 'Group', reaction: "📊" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    try {
        let ppgroup;
        try {
            ppgroup = await zk.profilePictureUrl(dest, 'image');
        } catch {
            ppgroup = conf.IMAGE_MENU || "https://i.imgur.com/xYrY5RH.jpg";
        }

        const info = await zk.groupMetadata(dest);
        const timestamp = moment().format('HH:mm:ss DD/MM/YYYY');

        const message = {
            image: { url: ppgroup },
            caption: `╭─⊷ *📊 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡* ⊶
│
├─ *👥 𝗕𝗔𝗦𝗜𝗖 𝗜𝗡𝗙𝗢*
│   • Name: ${info.subject}
│   • ID: ${dest}
│   • Created: ${moment(info.creation * 1000).format('DD/MM/YYYY')}
│   • Updated: ${timestamp}
│
├─ *📈 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦*
│   • Members: ${info.participants.length}
│   • Admins: ${info.participants.filter(p => p.admin).length}
│   • Status: ${info.restrict ? "Locked 🔒" : "Open 🔓"}
│
├─ *📝 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡*
│   ${info.desc || 'No description set'}
│
╰─⊷ *𝗚𝗥𝗢𝗨𝗣 𝗗𝗘𝗧𝗔𝗜𝗅𝗦* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ *Use .link to get invite link*
🔧 *Admins: Use group commands for management*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`
        };

        await zk.sendMessage(dest, message, { quoted: ms });
    } catch (error) {
        console.error("Info command error:", error);
        await repondre(`❌ *Failed to fetch group information*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "antilink", categorie: 'Group', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
    
    if (!verifGroupe) {
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!superUser && !verifAdmin) {
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    const enetatoui = await verifierEtatJid(dest);
    
    try {
        if (!arg || !arg[0]) { 
            const statusMsg = enetatoui ? "🟢 ACTIVE" : "🔴 INACTIVE";
            
            return repondre(`╭─⊷ *🔗 𝗔𝗡𝗧𝗜-𝗟𝗜𝗡𝗞 𝗦𝗬𝗦𝗧𝗘𝗠* ⊶
│
├─ *📖 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .antilink on - Enable link blocking
│   • .antilink off - Disable link blocking
│   • .antilink action/remove - Remove link senders
│   • .antilink action/warn - Give warnings
│   • .antilink action/delete - Delete links only
│
├─ *🎯 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Status: ${statusMsg}
│   • Default Action: Delete links
│   • Database: ✅ Active
│
╰─⊷ *𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗬𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        }
        
        const action = arg[0].toLowerCase();
        
        if (action === 'on') {
            if (enetatoui) { 
                await repondre(`⚠️ *Anti-link is already active*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await ajouterOuMettreAJourJid(dest, "oui");
                await repondre(`✅ *Anti-link protection enabled*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else if (action === 'off') {
            if (enetatoui) { 
                await ajouterOuMettreAJourJid(dest, "non");
                await repondre(`✅ *Anti-link protection disabled*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await repondre(`⚠️ *Anti-link is not active*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else if (arg.join('').split("/")[0] === 'action') {
            const actionType = (arg.join('').split("/")[1]).toLowerCase();
            
            if (actionType === 'remove' || actionType === 'warn' || actionType === 'delete') {
                await mettreAJourAction(dest, actionType);
                await repondre(`✅ *Action updated to: ${actionType}*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await repondre(`❌ *Valid actions: remove, warn, delete*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else {
            await repondre(`❌ *Invalid option*\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    } catch (error) {
        console.error("Anti-link error:", error);
        await repondre(`❌ *Failed to update anti-link settings*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "antibot", categorie: 'Group', reaction: "🤖" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
    
    if (!verifGroupe) {
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!superUser && !verifAdmin) {
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    const enetatoui = await atbverifierEtatJid(dest);
    
    try {
        if (!arg || !arg[0]) { 
            const statusMsg = enetatoui ? "🟢 ACTIVE" : "🔴 INACTIVE";
            
            return repondre(`╭─⊷ *🤖 𝗔𝗡𝗧𝗜-𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠* ⊶
│
├─ *📖 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .antibot on - Enable bot blocking
│   • .antibot off - Disable bot blocking
│   • .antibot action/remove - Remove bots
│   • .antibot action/warn - Give warnings
│   • .antibot action/delete - Delete bot messages
│
├─ *🎯 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Status: ${statusMsg}
│   • Default Action: Delete messages
│   • Database: ✅ Active
│
╰─⊷ *𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗔𝗚𝗔𝗜𝗡𝗦𝗧 𝗕𝗢𝗧𝗦* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        }
        
        const action = arg[0].toLowerCase();
        
        if (action === 'on') {
            if (enetatoui) { 
                await repondre(`⚠️ *Anti-bot is already active*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await atbajouterOuMettreAJourJid(dest, "oui");
                await repondre(`✅ *Anti-bot protection enabled*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else if (action === 'off') {
            if (enetatoui) { 
                await atbajouterOuMettreAJourJid(dest, "non");
                await repondre(`✅ *Anti-bot protection disabled*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await repondre(`⚠️ *Anti-bot is not active*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else if (arg.join('').split("/")[0] === 'action') {
            const actionType = (arg.join('').split("/")[1]).toLowerCase();
            
            if (actionType === 'remove' || actionType === 'warn' || actionType === 'delete') {
                await mettreAJourAction(dest, actionType);
                await repondre(`✅ *Action updated to: ${actionType}*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await repondre(`❌ *Valid actions: remove, warn, delete*\n\n🔐 Powered by: ${BOT_NAME}`);
            }
        } else {
            await repondre(`❌ *Invalid option*\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    } catch (error) {
        console.error("Anti-bot error:", error);
        await repondre(`❌ *Failed to update anti-bot settings*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "group", categorie: 'Group', reaction: "⚙️" }, async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!superUser && !verifAdmin) {
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    if (!arg || !arg[0]) { 
        return repondre(`╭─⊷ *⚙️ 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦* ⊶
│
├─ *📖 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .group open - Open group (all can send)
│   • .group close - Close group (admins only)
│
├─ *🎯 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Check with .info command
│
╰─⊷ *𝗠𝗔𝗡𝗔𝗚𝗘 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }

    const option = arg[0].toLowerCase();
    
    try {
        switch (option) {
            case "open":
                await zk.groupSettingUpdate(dest, 'not_announcement');
                await repondre(`✅ *Group opened successfully*\nAll members can now send messages.\n\n🔐 Powered by: ${BOT_NAME}`);
                break;
            case "close":
                await zk.groupSettingUpdate(dest, 'announcement');
                await repondre(`✅ *Group closed successfully*\nOnly admins can send messages.\n\n🔐 Powered by: ${BOT_NAME}`);
                break;
            default: 
                await repondre(`❌ *Invalid option. Use: open or close*\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    } catch (error) {
        console.error("Group settings error:", error);
        await repondre(`❌ *Failed to update group settings*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "left", categorie: "Mods", reaction: "👋" }, async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, superUser } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!superUser) {
        return repondre(`⛔ *Command reserved for bot owner*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    await repondre(`╭─⊷ *👋 𝗕𝗢𝗧 𝗟𝗘𝗔𝗩𝗜𝗡𝗚* ⊶
│
├─ *🎯 𝗔𝗖𝗧𝗜𝗢𝗡*
│   • Bot is leaving the group
│   • Time: ${moment().format('HH:mm:ss')}
│   • Date: ${moment().format('DD/MM/YYYY')}
│
╰─⊷ *𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𝗔𝗡𝗗 𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    await zk.groupLeave(dest);
});

zokou({ nomCom: "gname", categorie: 'Group', reaction: "📝" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!arg || !arg[0]) {
        return repondre(`❌ *Please enter the new group name*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    const nom = arg.join(' ');
    
    try {
        await zk.groupUpdateSubject(dest, nom);
        await repondre(`✅ *Group name updated to:* ${nom}\n\n🔐 Powered by: ${BOT_NAME}`);
    } catch (error) {
        console.error("Group name error:", error);
        await repondre(`❌ *Failed to update group name*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "gdesc", categorie: 'Group', reaction: "📄" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!arg || !arg[0]) {
        return repondre(`❌ *Please enter the new group description*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    const desc = arg.join(' ');
    
    try {
        await zk.groupUpdateDescription(dest, desc);
        await repondre(`✅ *Group description updated*\n\n🔐 Powered by: ${BOT_NAME}`);
    } catch (error) {
        console.error("Group description error:", error);
        await repondre(`❌ *Failed to update group description*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "gpp", categorie: 'Group', reaction: "🖼️" }, async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!msgRepondu || !msgRepondu.imageMessage) {
        return repondre(`❌ *Please send or mention an image*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    try {
        const pp = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        await zk.updateProfilePicture(dest, { url: pp })
            .then(() => {
                zk.sendMessage(dest, { text: `✅ *Group picture updated successfully*\n\n🔐 Powered by: ${BOT_NAME}` });
                fs.unlinkSync(pp);
            })
            .catch((err) => {
                console.error("Group picture error:", err);
                zk.sendMessage(dest, { text: `❌ *Failed to update group picture*\n\n🔐 Powered by: ${BOT_NAME}` });
                if (fs.existsSync(pp)) fs.unlinkSync(pp);
            });
    } catch (error) {
        console.error("Group picture error:", error);
        await repondre(`❌ *Failed to update group picture*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

zokou({ nomCom: "hidetag", categorie: 'Group', reaction: "📨" }, async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu, verifGroupe, arg, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) { 
        return repondre(`❌ *Group command only*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
    
    if (!verifAdmin && !superUser) { 
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const message = arg && arg.length > 0 ? arg.join(' ') : 
                   (msgRepondu && msgRepondu.conversation ? msgRepondu.conversation : 'Attention all members!');
    
    try {
        const metadata = await zk.groupMetadata(dest);
        const participants = metadata.participants.map(p => p.id);
        
        const hideTagMsg = `╭─⊷ *📨 𝗛𝗜𝗗𝗗𝗘𝗡 𝗧𝗔𝗚* ⊶
│
├─ *👥 𝗚𝗥𝗢𝗨𝗣*
│   • ${metadata.subject}
│   • Members: ${participants.length}
│
├─ *📝 𝗠𝗘𝗦𝗦𝗔𝗚𝗘*
│   ${message}
│
╰─⊷ *𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧 𝗙𝗥𝗢𝗠 𝗔𝗗𝗠𝗜𝗡* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await zk.sendMessage(dest, { 
            text: hideTagMsg, 
            mentions: participants 
        });
    } catch (error) {
        console.error("Hidetag error:", error);
        await repondre(`❌ *Failed to send hidden tag*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

// ==================== APK DOWNLOADER COMMAND ====================
zokou({ 
    nomCom: "apk", 
    reaction: "📱", 
    categorie: "Downloads" 
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        const appName = arg.join(' ');
        
        if (!appName) {
            return repondre(`╭─⊷ *📱 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥* ⊶
│
├─ *📖 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .apk [application name]
│   • Example: .apk whatsapp
│   • Example: .apk facebook lite
│
├─ *🎯 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦:*
│   • Search APK files
│   • Direct download links
│   • File size information
│   • Automatic installation
│
╰─⊷ *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗔𝗡𝗬 𝗔𝗣𝗣* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        }

        // Show searching message
        await repondre(`🔍 *Searching for:* ${appName}\n⏳ Please wait...\n\n🔐 Powered by: ${BOT_NAME}`);

        const searchResults = await search(appName);

        if (searchResults.length === 0) {
            return repondre(`❌ *Application not found*\n\nPlease try another name or check spelling.\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        const appData = await download(searchResults[0].id);
        const fileSize = parseFloat(appData.size);

        // Check file size (300MB limit)
        if (fileSize > 300) {
            return repondre(`❌ *File size exceeds limit*\n\n• Application: ${appData.name}\n• Size: ${appData.size}\n• Limit: 300 MB\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        const downloadLink = appData.dllink;
        
        // Create caption with app info
        const captionText = `╭─⊷ *📱 𝗔𝗣𝗞 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡* ⊶
│
├─ *🎯 𝗔𝗣𝗣 𝗗𝗘𝗧𝗔𝗜𝗟𝗦*
│   • Name: ${appData.name}
│   • Package: ${appData.package}
│   • Version: ${appData.lastup}
│   • Size: ${appData.size}
│   • Downloads: ${appData.downloads || 'N/A'}
│
├─ *📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗜𝗡𝗙𝗢*
│   • Status: ✅ Ready
│   • Link: Active
│   • Size: Within limits
│
╰─⊷ *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗜𝗡𝗚...* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗡𝗢𝗧𝗘:* Download will start shortly
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

        const apkFileName = (appData.name || "Downloader") + ".apk";
        const filePath = apkFileName;

        // Send app icon and info first
        await zk.sendMessage(dest, { 
            image: { url: appData.icon }, 
            caption: captionText 
        }, { quoted: ms });

        // Download the APK file
        const response = await axios({
            method: 'GET',
            url: downloadLink,
            responseType: 'stream'
        });

        const fileWriter = fs.createWriteStream(filePath);
        response.data.pipe(fileWriter);

        await new Promise((resolve, reject) => {
            fileWriter.on('finish', resolve);
            fileWriter.on("error", reject);
        });

        // Send the APK file
        const documentMessage = {
            document: fs.readFileSync(filePath),
            mimetype: 'application/vnd.android.package-archive',
            fileName: apkFileName,
            caption: `✅ *${appData.name} APK Download Complete*\n\n📦 File: ${apkFileName}\n📊 Size: ${appData.size}\n\n🔐 Powered by: ${BOT_NAME}`
        };

        await zk.sendMessage(dest, documentMessage, { quoted: ms });

        // Clean up - delete the file
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error('APK command error:', error);
        
        if (error.message.includes('timeout')) {
            await repondre(`❌ *Download timeout*\n\nThe server is taking too long to respond. Please try again later.\n\n🔐 Powered by: ${BOT_NAME}`);
        } else if (error.message.includes('network')) {
            await repondre(`❌ *Network error*\n\nPlease check your internet connection and try again.\n\n🔐 Powered by: ${BOT_NAME}`);
        } else if (error.message.includes('size')) {
            await repondre(`❌ *File size error*\n\nThe APK file is too large to download.\n\n🔐 Powered by: ${BOT_NAME}`);
        } else {
            await repondre(`❌ *APK download failed*\n\nError: ${error.message}\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    }
});

// ==================== AUTOMUTE COMMAND ====================
zokou({
    nomCom: 'automute',
    categorie: 'Group',
    reaction: "⏰"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) { 
        return repondre(`⛔ *You are not an administrator of the group*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const group_cron = await cron.getCronById(dest);
    
    if (!arg || arg.length == 0) {
        let state;
        if (group_cron == null || group_cron.mute_at == null) {
            state = "No time set for automatic mute";
        } else {
            state = `The group will be muted at ${(group_cron.mute_at).split(':')[0]}:${(group_cron.mute_at).split(':')[1]}`;
        }

        const msg = `╭─⊷ *⏰ 𝗔𝗨𝗧𝗢𝗠𝗨𝗧𝗘 𝗦𝗬𝗦𝗧𝗘𝗠* ⊶
│
├─ *📖 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Status: ${state}
│   • Database: ✅ Active
│
├─ *🎯 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .automute HH:MM - Set auto mute time
│   • Example: .automute 21:30
│   • .automute del - Remove auto mute
│
╰─⊷ *𝗔𝗨𝗧𝗢𝗠𝗔𝗧𝗘𝗗 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗜𝗢𝗡* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗡𝗢𝗧𝗘:* Bot restart required after changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

        return repondre(msg);
    } else {
        const texte = arg.join(' ');

        if (texte.toLowerCase() === `del`) { 
            if (group_cron == null) {
                await repondre(`⚠️ *No cron schedule is active*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await cron.delCron(dest);
                await repondre(`✅ *Auto mute removed*\nRestart bot to apply changes\n\n🔐 Powered by: ${BOT_NAME}`)
                .then(() => {
                    exec("pm2 restart all");
                });
            }
        } else if (texte.includes(':')) {
            await cron.addCron(dest, "mute_at", texte);
            await repondre(`✅ *Auto mute set for ${texte}*\nRestart bot to apply changes\n\n🔐 Powered by: ${BOT_NAME}`)
            .then(() => {
                exec("pm2 restart all");
            });
        } else {
            await repondre(`❌ *Invalid time format*\n\nPlease use HH:MM format (e.g., 21:30)\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    }
});

// ==================== AUTOUNMUTE COMMAND ====================
zokou({
    nomCom: 'autounmute',
    categorie: 'Group',
    reaction: "🔓"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) { 
        return repondre(`⛔ *You are not an administrator of the group*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const group_cron = await cron.getCronById(dest);
    
    if (!arg || arg.length == 0) {
        let state;
        if (group_cron == null || group_cron.unmute_at == null) {
            state = "No time set for auto unmute";
        } else {
            state = `Group will be unmuted at ${(group_cron.unmute_at).split(':')[0]}:${(group_cron.unmute_at).split(':')[1]}`;
        }

        const msg = `╭─⊷ *🔓 𝗔𝗨𝗧𝗢𝗨𝗡𝗠𝗨𝗧𝗘 𝗦𝗬𝗦𝗧𝗘𝗠* ⊶
│
├─ *📖 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Status: ${state}
│   • Database: ✅ Active
│
├─ *🎯 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .autounmute HH:MM - Set auto unmute time
│   • Example: .autounmute 07:30
│   • .autounmute del - Remove auto unmute
│
╰─⊷ *𝗔𝗨𝗧𝗢𝗠𝗔𝗧𝗘𝗗 𝗦𝗖𝗛𝗘𝗗𝗨𝗟𝗜𝗡𝗚* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗡𝗢𝗧𝗘:* Bot restart required after changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

        return repondre(msg);
    } else {
        const texte = arg.join(' ');

        if (texte.toLowerCase() === `del`) { 
            if (group_cron == null) {
                await repondre(`⚠️ *No cron schedule is active*\n\n🔐 Powered by: ${BOT_NAME}`);
            } else {
                await cron.delCron(dest);
                await repondre(`✅ *Auto unmute removed*\nRestart bot to apply changes\n\n🔐 Powered by: ${BOT_NAME}`)
                .then(() => {
                    exec("pm2 restart all");
                });
            }
        } else if (texte.includes(':')) {
            await cron.addCron(dest, "unmute_at", texte);
            await repondre(`✅ *Auto unmute set for ${texte}*\nRestart bot to apply changes\n\n🔐 Powered by: ${BOT_NAME}`)
            .then(() => {
                exec("pm2 restart all");
            });
        } else {
            await repondre(`❌ *Invalid time format*\n\nPlease use HH:MM format (e.g., 07:30)\n\n🔐 Powered by: ${BOT_NAME}`);
        }
    }
});

// ==================== FKICK COMMAND ====================
zokou({
    nomCom: 'fkick',
    categorie: 'Group',
    reaction: "🌍"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin, superUser, verifZokouAdmin } = commandeOptions;

    if (verifAdmin || superUser) {
        if (!verifZokouAdmin) { 
            return repondre(`⛔ *You need administrative rights to perform this command*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        if (!arg || arg.length == 0) { 
            return repondre(`❌ *Please enter the country code*\n\nExample: .fkick 255 (for Tanzania)\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        const metadata = await zk.groupMetadata(dest);
        const participants = metadata.participants;
        let kickedCount = 0;

        const progressMsg = await repondre(`🔍 *Scanning members with country code:* ${arg[0]}\n⏳ Please wait...`);

        for (let i = 0; i < participants.length; i++) {
            if (participants[i].id.startsWith(arg[0]) && participants[i].admin === null) {
                try {
                    await zk.groupParticipantsUpdate(dest, [participants[i].id], "remove");
                    kickedCount++;
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`Failed to kick ${participants[i].id}:`, error);
                }
            }
        }

        await repondre(`✅ *Mass kick completed*\n\n• Country Code: ${arg[0]}\n• Members Kicked: ${kickedCount}\n• Total Scanned: ${participants.length}\n\n🔐 Powered by: ${BOT_NAME}`);

    } else {
        await repondre(`⛔ *You are not a group administrator*\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

// ==================== NSFW COMMAND ====================
zokou({
    nomCom: 'nsfw',
    categorie: 'Group',
    reaction: "🔞"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) { 
        return repondre(`⛔ *Administrator privileges required*\n\n🔐 Powered by: ${BOT_NAME}`);
    }

    const isHentaiGroupe = await hbd.checkFromHentaiList(dest);

    if (!arg || !arg[0]) {
        const status = isHentaiGroupe ? "🟢 ACTIVE" : "🔴 INACTIVE";
        
        return repondre(`╭─⊷ *🔞 𝗡𝗦𝗙𝗪 𝗖𝗢𝗡𝗧𝗘𝗡𝗧 𝗖𝗢𝗡𝗧𝗥𝗢𝗟* ⊶
│
├─ *📖 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Status: ${status}
│   • Database: ✅ Active
│
├─ *🎯 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .nsfw on - Enable NSFW content
│   • .nsfw off - Disable NSFW content
│
├─ *⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚*
│   • Adult content warning
│   • 18+ age restriction
│   • Use responsibly
│
╰─⊷ *𝗖𝗢𝗡𝗧𝗘𝗡𝗧 𝗖𝗢𝗡𝗧𝗥𝗢𝗟* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Powered by:* ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }

    if (arg[0] == 'on') {
        if (isHentaiGroupe) {
            return repondre(`⚠️ *NSFW content is already active*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        await hbd.addToHentaiList(dest);
        return repondre(`✅ *NSFW content enabled*\n\n⚠️ Warning: 18+ content now allowed\n\n🔐 Powered by: ${BOT_NAME}`);

    } else if (arg[0] == 'off') {
        if (!isHentaiGroupe) {
            return repondre(`⚠️ *NSFW content is already disabled*\n\n🔐 Powered by: ${BOT_NAME}`);
        }

        await hbd.removeFromHentaiList(dest);
        return repondre(`✅ *NSFW content disabled*\n\n🔞 Adult content now restricted\n\n🔐 Powered by: ${BOT_NAME}`);

    } else {
        return repondre(`❌ *Invalid option*\n\nUse: .nsfw on or .nsfw off\n\n🔐 Powered by: ${BOT_NAME}`);
    }
});

// ==================== ANTI-BADWORD LISTENER ====================
zokou({
    nomCom: '__antibadword_listener__'
}, async (dest, zk, { msg, verifGroupe, auteurMessage, nomAuteurMessage }) => {
    if (!verifGroupe) return;
    
    // Check if anti-badword is enabled for this group
    // This would need your anti-badword database integration
    
    const text = (
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        msg?.imageMessage?.caption ||
        ""
    ).toLowerCase();

    if (!text) return;

    // Example bad words list - integrate with your database
    const badWords = [
        "qmmk", "kmmk", "kumamake", "fala", "chizi", "msenge", "choko",
        "fuck", "shit", "bitch", "ass", "sex", "porn", "dick", "pussy"
    ];

    const detectedWords = badWords.filter(word => text.includes(word));

    if (detectedWords.length === 0) return;

    try {
        // Delete the offensive message
        await zk.sendMessage(dest, {
            delete: {
                remoteJid: dest,
                fromMe: false,
                id: msg.key.id,
                participant: auteurMessage
            }
        });

        // Send warning message
        const warningMsg = `╭─⊷ *⚠️ 𝗜𝗡𝗔𝗣𝗣𝗥𝗢𝗣𝗥𝗜𝗔𝗧𝗘 𝗖𝗢𝗡𝗧𝗘𝗡𝗧* ⊶
│
├─ *👤 𝗨𝗦𝗘𝗥*
│   • Name: ${nomAuteurMessage || 'Unknown'}
│   • ID: @${auteurMessage.split("@")[0]}
│
├─ *🚫 𝗩𝗜𝗢𝗟𝗔𝗧𝗜𝗢𝗡*
│   • Reason: Bad language detected
│   • Action: Message deleted
│   • Words: ${detectedWords.join(', ')}
│
├─ *📜 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦*
│   1. No offensive language
│   2. Respect all members
│   3. Maintain positive environment
│
╰─⊷ *𝗥𝗘𝗦𝗣𝗘𝗖𝗧 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗪𝗔𝗥𝗡𝗜𝗡𝗚:* Repeated violations may result
in removal from the group.
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${BOT_NAME}`;

        await zk.sendMessage(dest, {
            text: warningMsg,
            mentions: [auteurMessage]
        });

    } catch (error) {
        console.error("Anti-badword listener error:", error);
    }
});

console.log(`✅ All 21 group management commands loaded successfully for ${BOT_NAME}!`);
