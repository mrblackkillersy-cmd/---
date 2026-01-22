const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");
const moment = require("moment-timezone");

// Set timezone
moment.tz.setDefault("Africa/Tanzania");

// OWNER COMMAND - REDESIGNED
zokou({ 
    nomCom: "owner", 
    categorie: "General", 
    reaction: "👑" 
}, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;
    
    const thsudo = await isSudoTableNotEmpty();
    const currentTime = moment().format('HH:mm:ss');
    const currentDate = moment().format('DD/MM/YYYY');

    if (thsudo) {
        let msg = `╭─⊷ *👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥𝗦* ⊶
│
├─ *🎯 𝗣𝗥𝗜𝗠𝗔𝗥𝗬 𝗢𝗪𝗡𝗘𝗥*
│   • Name: ${conf.OWNER_NAME}
│   • Number: @${conf.NUMERO_OWNER}
│   • Role: Creator & Developer
│   • Status: 🟢 Online
│
├─ *⚡ 𝗦𝗨𝗣𝗘𝗥 𝗨𝗦𝗘𝗥𝗦*
│`;

        let sudos = await getAllSudoNumbers();
        let sudonumero;
        let sudoCount = 0;
        
        for (const sudo of sudos) {
            if (sudo && sudo.trim() !== '') {
                sudoCount++;
                sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `│   ${sudoCount}. @${sudonumero}\n`;
            }
        }

        msg += `│
├─ *📊 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗦*
│   • Sudo Users: ${sudoCount}
│   • Bot Name: ${conf.BOT}
│   • Time: ${currentTime}
│   • Date: ${currentDate}
│
╰─⊷ *𝗔𝗖𝗖𝗘𝗦𝗦 𝗟𝗘𝗩𝗘𝗟: 𝗦𝗨𝗣𝗘𝗥 𝗔𝗗𝗠𝗜𝗡* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🛡️ 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗘𝗗 𝗕𝗬:*
𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        const mentionedJid = sudos.concat([ownerjid]);

        try {
            await zk.sendMessage(dest, {
                image: { url: mybotpic() },
                caption: msg,
                mentions: mentionedJid,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: false,
                    externalAdReply: {
                        title: `⚡ ${conf.BOT} Ownership`,
                        body: `Contact: @${conf.NUMERO_OWNER}`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: "https://i.imgur.com/xYrY5RH.jpg", // Custom thumbnail
                        sourceUrl: `https://wa.me/${conf.NUMERO_OWNER}`
                    }
                }
            }, { quoted: ms });
        } catch (e) {
            console.log("❌ Owner command error:", e);
            await zk.sendMessage(dest, { text: msg, mentions: mentionedJid }, { quoted: ms });
        }
    } else {
        // VCARD for single owner
        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${conf.OWNER_NAME}\n` +
            `ORG:${conf.BOT} Development Team\n` +
            `TEL;type=CELL;type=VOICE;waid=${conf.NUMERO_OWNER}:+${conf.NUMERO_OWNER}\n` +
            `NOTE:Bot Owner & Developer\n` +
            'END:VCARD';

        await zk.sendMessage(dest, {
            contacts: {
                displayName: `👑 ${conf.OWNER_NAME}`,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});

// DEV COMMAND - REDESIGNED
zokou({ 
    nomCom: "dev", 
    categorie: "General", 
    reaction: "💻" 
}, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
        { 
            nom: "𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥", 
            numero: "255681613368",
            role: "Lead Developer & Founder",
            expertise: "AI Integration, Security, Automation"
        },
        // Add more developers here
    ];

    let message = `╭─⊷ *💻 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗧𝗘𝗔𝗠* ⊶
│
├─ *🚀 ${conf.BOT} DEVELOPMENT*
│   • Version: ${conf.VERSION || 'v3.5.0'}
│   • Status: 🟢 Active Development
│   • Support: 24/7 Technical
│
├─ *👨‍💻 𝗖𝗢𝗥𝗘 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥𝗦*
│`;

    for (const dev of devs) {
        message += `│
│   ┌─ *${dev.nom}*
│   ├─ 📞 https://wa.me/${dev.numero}
│   ├─ 🎯 ${dev.role}
│   └─ 🔧 ${dev.expertise}
│`;
    }

    message += `│
├─ *📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗜𝗡𝗙𝗢*
│   • Priority: Developer Issues
│   • Response Time: < 24 hours
│   • Languages: English, Kiswahili
│   • Hours: Monday - Sunday
│
╰─⊷ *𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*⚡ 𝗤𝗨𝗜𝗖𝗞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧:*
Click name above or call directly
━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    try {
        const lien = mybotpic();
        
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, { 
                video: { url: lien }, 
                caption: message,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: false
                }
            }, { quoted: ms });
        } else if (lien.match(/\.(jpeg|png|jpg|webp)$/i)) {
            await zk.sendMessage(dest, { 
                image: { url: lien }, 
                caption: message,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: false,
                    externalAdReply: {
                        title: `👨‍💻 ${conf.BOT} Developers`,
                        body: `Contact our development team`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: "https://i.imgur.com/JK7pQy3.jpg",
                        sourceUrl: `https://wa.me/255681613368`
                    }
                }
            }, { quoted: ms });
        } else {
            await zk.sendMessage(dest, { 
                text: message,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: false
                }
            }, { quoted: ms });
        }
    } catch (e) {
        console.log("❌ Dev command error:", e);
        await zk.sendMessage(dest, { text: message }, { quoted: ms });
    }
});

// SUPPORT COMMAND - REDESIGNED
zokou(
    { 
        nomCom: "support", 
        categorie: "General", 
        reaction: "🛟" 
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre } = commandeOptions;

        const supportMessage = `╭─⊷ *🛟 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 & 𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬* ⊶
│
├─ *🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 ${conf.BOT}*
│   Your ultimate WhatsApp automation solution
│   with advanced features and 24/7 support.
│
├─ *📢 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟*
│   ┌─ *🔔 Updates & Announcements*
│   ├─ *🎯 Feature Previews*
│   ├─ *🛠️ Beta Testing*
│   └─ *📈 Development Roadmap*
│
│   ╰─ *🔗 https://whatsapp.com/channel/0029VbAhAOJISTkRkIw3Sy1D*
│
├─ *👥 𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬 𝗚𝗥𝗢𝗨𝗣*
│   ┌─ *💬 Active Discussions*
│   ├─ *🤝 Peer Support*
│   ├─ *🎮 Bot Games & Events*
│   └─ *📚 Tutorials & Guides*
│
│   ╰─ *🔗 https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76*
│
├─ *📞 𝗗𝗜𝗥𝗘𝗖𝗧 𝗦𝗨𝗣𝗣𝗢𝗥𝗧*
│   • Developer: https://wa.me/255681613368
│   • Response: Within 24 hours
│   • Issues: Bug reports & suggestions
│
├─ *🎯 𝗕𝗘𝗡𝗘𝗙𝗜𝗧𝗦 𝗢𝗙 𝗝𝗢𝗜𝗡𝗜𝗡𝗚*
│   ✅ Early access to new features
│   ✅ Priority technical support
│   ✅ Exclusive bot commands
│   ✅ Community recognition
│   ✅ Direct developer feedback
│
╰─⊷ *𝗦𝗧𝗔𝗬 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗, 𝗦𝗧𝗔𝗬 𝗔𝗛𝗘𝗔𝗗* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*⚠️ 𝗜𝗠𝗣𝗢𝗥𝗧𝗔𝗡𝗧 𝗡𝗢𝗧𝗜𝗖𝗘:*
1. Always join our official channels
2. Report bugs with .bug [description]
3. Suggest features with .suggest [idea]
4. Respect community guidelines
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥*
*🎯 𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗔𝗨𝗧𝗢𝗠𝗔𝗧𝗜𝗢𝗡*
`;

        await repondre({
            text: supportMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: false,
                externalAdReply: {
                    title: `🌟 ${conf.BOT} Community`,
                    body: `Join our official groups & channel`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: "https://i.imgur.com/9pZ4L8s.jpg",
                    sourceUrl: "https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76"
                }
            }
        });
    }
);

// ADDITIONAL: BUG REPORT COMMAND
zokou(
    { 
        nomCom: "bug", 
        categorie: "General", 
        reaction: "🐛",
        desc: "Report bugs or issues"
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, arg } = commandeOptions;
        
        if (!arg || arg.trim() === '') {
            return await repondre(`╭─⊷ *🐛 𝗕𝗨𝗚 𝗥𝗘𝗣𝗢𝗥𝗧𝗜𝗡𝗚* ⊶
│
├─ *📝 𝗨𝗦𝗔𝗚𝗘:*
│   .bug [description of the bug]
│
├─ *🎯 𝗘𝗫𝗔𝗠𝗣𝗟𝗘𝗦:*
│   • .bug Bot not responding to .ai command
│   • .bug Weather command showing wrong data
│   • .bug Error when downloading videos
│
├─ *📊 𝗜𝗡𝗖𝗟𝗨𝗗𝗘:*
│   1. Command that failed
│   2. Error message (if any)
│   3. Steps to reproduce
│   4. Your WhatsApp number
│
╰─⊷ *𝗪𝗘 𝗩𝗔𝗟𝗨𝗘 𝗬𝗢𝗨𝗥 𝗙𝗘𝗘𝗗𝗕𝗔𝗖𝗞* ⊶`);
        }

        const bugReport = `╭─⊷ *🐛 𝗡𝗘𝗪 𝗕𝗨𝗚 𝗥𝗘𝗣𝗢𝗥𝗧* ⊶
│
├─ *👤 𝗥𝗘𝗣𝗢𝗥𝗧𝗘𝗗 𝗕𝗬:*
│   • User: ${ms.pushName || 'Unknown'}
│   • Number: ${dest.split('@')[0]}
│   • Time: ${moment().format('HH:mm:ss')}
│   • Date: ${moment().format('DD/MM/YYYY')}
│
├─ *📝 𝗕𝗨𝗚 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡:*
│   ${arg}
│
╰─⊷ *𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨 𝗙𝗢𝗥 𝗥𝗘𝗣𝗢𝗥𝗧𝗜𝗡𝗚!* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🔄 𝗦𝗧𝗔𝗧𝗨𝗦:* Reported to developers
*⏰ 𝗘𝗦𝗧𝗜𝗠𝗔𝗧𝗘:* Fixed in next update
*📞 𝗙𝗢𝗟𝗟𝗢𝗪-𝗨𝗣:* Keep bot updated
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await repondre(bugReport);
        
        // Optional: Send to developer/owner
        const ownerJid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        try {
            await zk.sendMessage(ownerJid, {
                text: `🚨 *NEW BUG REPORT*\n\nFrom: ${ms.pushName || 'Unknown'} (${dest.split('@')[0]})\n\nBug: ${arg}\n\nTime: ${moment().format('HH:mm:ss DD/MM/YYYY')}`
            });
        } catch (e) {
            console.log("Could not send bug report to owner:", e);
        }
    }
);

console.log("✅ Owner/Dev/Support commands loaded with new design!");
