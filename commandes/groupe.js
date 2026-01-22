const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
const fs = require("fs-extra");
const conf = require("../set");
const moment = require("moment-timezone");

// Set timezone
moment.tz.setDefault("Africa/Tanzania");

// ==================== GROUP MANAGEMENT COMMANDS ====================

zokou({ nomCom: "tagall", categorie: 'Group', reaction: "🏷️" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) { 
        return repondre("❌ *This command is reserved for groups only*");
    }

    if (!verifAdmin && !superUser) { 
        return repondre("⛔ *Command reserved for group administrators*");
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await zk.sendMessage(dest, { 
        text: tag, 
        mentions: infosGroupe.participants.map((i) => i.id) 
    }, { quoted: ms });
});

zokou({ nomCom: "link", categorie: 'Group', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre("❌ *This command is for groups only*");
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
🔐 *Powered by:* ${conf.BOT}`;

        await repondre(message);
    } catch (error) {
        console.error("Link command error:", error);
        await repondre("❌ *Failed to generate group link*");
    }
});

zokou({ nomCom: "promote", categorie: 'Group', reaction: "⬆️" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
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
            return repondre("⛔ *Administrator privileges required*");
        }

        if (!msgRepondu) {
            return repondre("👤 *Please mention the member to promote*");
        }

        if (!isBotAdmin) {
            return repondre("🤖 *Bot needs admin rights to perform this action*");
        }

        const targetExists = membresGroupe.some(m => m.id === auteurMsgRepondu);
        if (!targetExists) {
            return repondre("❌ *User is not in this group*");
        }

        if (isTargetAdmin) {
            return repondre("⚠️ *User is already an administrator*");
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
╰─⊷ *𝗡𝗘𝗪 𝗣𝗥𝗜𝗩𝗜𝗟𝗘𝗚𝗘𝗦 𝗚𝗥𝗔𝗡𝗧𝗘𝗗* ⊶`;

        await zk.sendMessage(dest, { 
            text: successMsg, 
            mentions: [auteurMsgRepondu] 
        });
    } catch (error) {
        console.error("Promote error:", error);
        await repondre("❌ *Failed to promote user*");
    }
});

zokou({ nomCom: "demote", categorie: 'Group', reaction: "⬇️" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
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
            return repondre("⛔ *Administrator privileges required*");
        }

        if (!msgRepondu) {
            return repondre("👤 *Please mention the admin to demote*");
        }

        if (!isBotAdmin) {
            return repondre("🤖 *Bot needs admin rights to perform this action*");
        }

        const targetExists = membresGroupe.some(m => m.id === auteurMsgRepondu);
        if (!targetExists) {
            return repondre("❌ *User is not in this group*");
        }

        if (!isTargetAdmin) {
            return repondre("⚠️ *User is not an administrator*");
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
╰─⊷ *𝗔𝗗𝗠𝗜𝗡 𝗣𝗥𝗜𝗩𝗜𝗟𝗘𝗚𝗘𝗦 𝗥𝗘𝗩𝗢𝗞𝗘𝗗* ⊶`;

        await zk.sendMessage(dest, { 
            text: successMsg, 
            mentions: [auteurMsgRepondu] 
        });
    } catch (error) {
        console.error("Demote error:", error);
        await repondre("❌ *Failed to demote user*");
    }
});

zokou({ nomCom: "remove", categorie: 'Group', reaction: "🚫" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
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
            return repondre("⛔ *Administrator privileges required*");
        }

        if (!msgRepondu) {
            return repondre("👤 *Please mention the member to remove*");
        }

        if (!isBotAdmin) {
            return repondre("🤖 *Bot needs admin rights to perform this action*");
        }

        const targetExists = membresGroupe.some(m => m.id === auteurMsgRepondu);
        if (!targetExists) {
            return repondre("❌ *User is not in this group*");
        }

        if (isTargetAdmin) {
            return repondre("⚠️ *Cannot remove group administrators*");
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await zk.sendMessage(dest, { 
            text: successMsg, 
            mentions: [auteurMsgRepondu] 
        });
    } catch (error) {
        console.error("Remove error:", error);
        await repondre("❌ *Failed to remove user*");
    }
});

zokou({ nomCom: "del", categorie: 'Group', reaction: "🗑️" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe, auteurMsgRepondu, idBot, msgRepondu, verifAdmin, superUser } = commandeOptions;
    
    if (!msgRepondu) {
        return repondre("❌ *Please mention the message to delete*");
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
                await repondre("❌ *I need admin rights to delete messages*");
            }
        } else {
            await repondre("⛔ *You are not a group administrator*");
        }
    }
});

zokou({ nomCom: "info", categorie: 'Group', reaction: "📊" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
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
╰─⊷ *𝗚𝗥𝗢𝗨𝗣 𝗗𝗘𝗧𝗔𝗜𝗟𝗦* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ *Use .link to get invite link*
🔧 *Admins: Use group commands for management*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* ${conf.BOT}`
        };

        await zk.sendMessage(dest, message, { quoted: ms });
    } catch (error) {
        console.error("Info command error:", error);
        await repondre("❌ *Failed to fetch group information*");
    }
});

zokou({ nomCom: "antilink", categorie: 'Group', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
    
    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }
    
    if (!superUser && !verifAdmin) {
        return repondre("⛔ *Administrator privileges required*");
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
╰─⊷ *𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗬𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣* ⊶`);
        }
        
        const action = arg[0].toLowerCase();
        
        if (action === 'on') {
            if (enetatoui) { 
                await repondre("⚠️ *Anti-link is already active*");
            } else {
                await ajouterOuMettreAJourJid(dest, "oui");
                await repondre("✅ *Anti-link protection enabled*");
            }
        } else if (action === 'off') {
            if (enetatoui) { 
                await ajouterOuMettreAJourJid(dest, "non");
                await repondre("✅ *Anti-link protection disabled*");
            } else {
                await repondre("⚠️ *Anti-link is not active*");
            }
        } else if (arg.join('').split("/")[0] === 'action') {
            const actionType = (arg.join('').split("/")[1]).toLowerCase();
            
            if (actionType === 'remove' || actionType === 'warn' || actionType === 'delete') {
                await mettreAJourAction(dest, actionType);
                await repondre(`✅ *Action updated to: ${actionType}*`);
            } else {
                await repondre("❌ *Valid actions: remove, warn, delete*");
            }
        } else {
            await repondre("❌ *Invalid option*");
        }
    } catch (error) {
        console.error("Anti-link error:", error);
        await repondre("❌ *Failed to update anti-link settings*");
    }
});

zokou({ nomCom: "antibot", categorie: 'Group', reaction: "🤖" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
    
    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }
    
    if (!superUser && !verifAdmin) {
        return repondre("⛔ *Administrator privileges required*");
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
╰─⊷ *𝗣𝗥𝗢𝗧𝗘𝗖𝗧 𝗔𝗚𝗔𝗜𝗡𝗦𝗧 𝗕𝗢𝗧𝗦* ⊶`);
        }
        
        const action = arg[0].toLowerCase();
        
        if (action === 'on') {
            if (enetatoui) { 
                await repondre("⚠️ *Anti-bot is already active*");
            } else {
                await atbajouterOuMettreAJourJid(dest, "oui");
                await repondre("✅ *Anti-bot protection enabled*");
            }
        } else if (action === 'off') {
            if (enetatoui) { 
                await atbajouterOuMettreAJourJid(dest, "non");
                await repondre("✅ *Anti-bot protection disabled*");
            } else {
                await repondre("⚠️ *Anti-bot is not active*");
            }
        } else if (arg.join('').split("/")[0] === 'action') {
            const actionType = (arg.join('').split("/")[1]).toLowerCase();
            
            if (actionType === 'remove' || actionType === 'warn' || actionType === 'delete') {
                await mettreAJourAction(dest, actionType);
                await repondre(`✅ *Action updated to: ${actionType}*`);
            } else {
                await repondre("❌ *Valid actions: remove, warn, delete*");
            }
        } else {
            await repondre("❌ *Invalid option*");
        }
    } catch (error) {
        console.error("Anti-bot error:", error);
        await repondre("❌ *Failed to update anti-bot settings*");
    }
});

zokou({ nomCom: "group", categorie: 'Group', reaction: "⚙️" }, async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
    }
    
    if (!superUser && !verifAdmin) {
        return repondre("⛔ *Administrator privileges required*");
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
╰─⊷ *𝗠𝗔𝗡𝗔𝗚𝗘 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦* ⊶`);
    }

    const option = arg[0].toLowerCase();
    
    try {
        switch (option) {
            case "open":
                await zk.groupSettingUpdate(dest, 'not_announcement');
                await repondre("✅ *Group opened successfully*\nAll members can now send messages.");
                break;
            case "close":
                await zk.groupSettingUpdate(dest, 'announcement');
                await repondre("✅ *Group closed successfully*\nOnly admins can send messages.");
                break;
            default: 
                await repondre("❌ *Invalid option. Use: open or close*");
        }
    } catch (error) {
        console.error("Group settings error:", error);
        await repondre("❌ *Failed to update group settings*");
    }
});

zokou({ nomCom: "left", categorie: "Mods", reaction: "👋" }, async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, superUser } = commandeOptions;
    
    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
    }
    
    if (!superUser) {
        return repondre("⛔ *Command reserved for bot owner*");
    }
    
    await repondre(`╭─⊷ *👋 𝗕𝗢𝗧 𝗟𝗘𝗔𝗩𝗜𝗡𝗚* ⊶
│
├─ *🎯 𝗔𝗖𝗧𝗜𝗢𝗡*
│   • Bot is leaving the group
│   • Time: ${moment().format('HH:mm:ss')}
│   • Date: ${moment().format('DD/MM/YYYY')}
│
╰─⊷ *𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𝗔𝗡𝗗 𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨* ⊶`);
    
    await zk.groupLeave(dest);
});

zokou({ nomCom: "gname", categorie: 'Group', reaction: "📝" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        return repondre("⛔ *Administrator privileges required*");
    }
    
    if (!arg || !arg[0]) {
        return repondre("❌ *Please enter the new group name*");
    }
    
    const nom = arg.join(' ');
    
    try {
        await zk.groupUpdateSubject(dest, nom);
        await repondre(`✅ *Group name updated to:* ${nom}`);
    } catch (error) {
        console.error("Group name error:", error);
        await repondre("❌ *Failed to update group name*");
    }
});

zokou({ nomCom: "gdesc", categorie: 'Group', reaction: "📄" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        return repondre("⛔ *Administrator privileges required*");
    }
    
    if (!arg || !arg[0]) {
        return repondre("❌ *Please enter the new group description*");
    }
    
    const desc = arg.join(' ');
    
    try {
        await zk.groupUpdateDescription(dest, desc);
        await repondre(`✅ *Group description updated*`);
    } catch (error) {
        console.error("Group description error:", error);
        await repondre("❌ *Failed to update group description*");
    }
});

zokou({ nomCom: "gpp", categorie: 'Group', reaction: "🖼️" }, async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        return repondre("⛔ *Administrator privileges required*");
    }
    
    if (!msgRepondu || !msgRepondu.imageMessage) {
        return repondre("❌ *Please send or mention an image*");
    }
    
    try {
        const pp = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        await zk.updateProfilePicture(dest, { url: pp })
            .then(() => {
                zk.sendMessage(dest, { text: "✅ *Group picture updated successfully*" });
                fs.unlinkSync(pp);
            })
            .catch((err) => {
                console.error("Group picture error:", err);
                zk.sendMessage(dest, { text: "❌ *Failed to update group picture*" });
                if (fs.existsSync(pp)) fs.unlinkSync(pp);
            });
    } catch (error) {
        console.error("Group picture error:", error);
        await repondre("❌ *Failed to update group picture*");
    }
});

zokou({ nomCom: "hidetag", categorie: 'Group', reaction: "📨" }, async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu, verifGroupe, arg, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) { 
        return repondre("❌ *Group command only*");
    }
    
    if (!verifAdmin && !superUser) { 
        return repondre("⛔ *Administrator privileges required*");
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
╰─⊷ *𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧 𝗙𝗥𝗢𝗠 𝗔𝗗𝗠𝗜𝗡* ⊶`;

        await zk.sendMessage(dest, { 
            text: hideTagMsg, 
            mentions: participants 
        });
    } catch (error) {
        console.error("Hidetag error:", error);
        await repondre("❌ *Failed to send hidden tag*");
    }
});

console.log("✅ All group management commands loaded successfully!");
