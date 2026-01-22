const { zokou } = require("../framework/zokou");

// In-memory storage (works without database)
let antibadwordGroups = new Set();
let badWordsDB = new Map(); // Map<groupJid, Array<badWords>>
let defaultBadWords = [
    "qmmk", "kmmk", "kumamake", "fala", "chizi", "msenge", "choko",
    "fuck", "shit", "bitch", "ass", "sex", "porn", "dick", "pussy",
    "motherfucker", "bastard", "whore", "slut", "asshole"
];

// Initialize bad words for a group
function initGroupBadWords(jid) {
    if (!badWordsDB.has(jid)) {
        badWordsDB.set(jid, [...defaultBadWords]); // Copy default words
    }
    return badWordsDB.get(jid);
}

// Get bad words for a group
function getBadWords(jid) {
    return badWordsDB.get(jid) || initGroupBadWords(jid);
}

// ==================== ANTI-BADWORD COMMAND ====================
zokou({ 
    nomCom: "antibadword", 
    categorie: "Group", 
    reaction: "🚫" 
}, async (dest, zk, { repondre, arg, verifGroupe, verifAdmin, superUser }) => {

    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }

    if (!verifAdmin && !superUser) {
        return repondre("⛔ *Administrator privileges required*");
    }

    if (!arg || !arg[0]) {
        const isEnabled = antibadwordGroups.has(dest);
        const status = isEnabled ? "🟢 ACTIVE" : "🔴 INACTIVE";
        const wordCount = getBadWords(dest).length;

        return repondre(`╭─⊷ *🚫 𝗔𝗡𝗧𝗜-𝗕𝗔𝗗𝗪𝗢𝗥𝗗 𝗦𝗬𝗦𝗧𝗘𝗠* ⊶
│
├─ *📖 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘:*
│   • .antibadword on - Enable protection
│   • .antibadword off - Disable protection
│   • .antibadword status - Check current status
│   • .addbadword [word] - Add custom bad word
│   • .delbadword [word] - Remove bad word
│   • .badwordlist - Show all blocked words
│
├─ *🎯 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦*
│   • Status: ${status}
│   • Blocked Words: ${wordCount}
│   • Storage: 📱 RAM Memory
│   • Action: Delete + Warning
│
╰─⊷ *𝗠𝗔𝗜𝗡𝗧𝗔𝗜𝗡 𝗚𝗥𝗢𝗨𝗣 𝗤𝗨𝗔𝗟𝗜𝗧𝗬* ⊶`);
    }

    const action = arg[0].toLowerCase();

    if (action === 'on') {
        if (antibadwordGroups.has(dest)) {
            await repondre("⚠️ *Anti-badword is already enabled*");
        } else {
            antibadwordGroups.add(dest);
            initGroupBadWords(dest); // Initialize if not exists
            await repondre(`✅ *ANTI-BADWORD PROTECTION ENABLED*\n\nBad words will be automatically deleted.`);
        }
    } else if (action === 'off') {
        if (antibadwordGroups.has(dest)) {
            antibadwordGroups.delete(dest);
            await repondre("❌ *ANTI-BADWORD PROTECTION DISABLED*");
        } else {
            await repondre("⚠️ *Anti-badword is not enabled*");
        }
    } else if (action === 'status') {
        const isEnabled = antibadwordGroups.has(dest);
        const wordCount = getBadWords(dest).length;
        const status = isEnabled ? "🟢 ACTIVE" : "🔴 INACTIVE";
        
        await repondre(`📊 *ANTI-BADWORD STATUS*\n\n• Status: ${status}\n• Blocked Words: ${wordCount}\n• Storage: RAM Memory`);
    } else {
        await repondre("❌ *Invalid option. Use: on, off, or status*");
    }
});

// ==================== ADD BAD WORD COMMAND ====================
zokou({ 
    nomCom: "addbadword", 
    categorie: "Group", 
    reaction: "➕" 
}, async (dest, zk, { repondre, arg, verifGroupe, verifAdmin, superUser }) => {

    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }

    if (!verifAdmin && !superUser) {
        return repondre("⛔ *Administrator privileges required*");
    }

    const word = arg.join(" ").toLowerCase().trim();
    if (!word) {
        return repondre("❌ *Please specify a word to add*\n\nExample: .addbadword example");
    }

    if (word.length < 2) {
        return repondre("❌ *Word must be at least 2 characters long*");
    }

    const groupBadWords = getBadWords(dest);
    
    if (groupBadWords.includes(word)) {
        return repondre(`⚠️ *"${word}" is already in the bad words list*`);
    }

    groupBadWords.push(word);
    await repondre(`✅ *BAD WORD ADDED*\n\n• Word: "${word}"\n• Total blocked words: ${groupBadWords.length}`);
});

// ==================== REMOVE BAD WORD COMMAND ====================
zokou({ 
    nomCom: "delbadword", 
    categorie: "Group", 
    reaction: "➖" 
}, async (dest, zk, { repondre, arg, verifGroupe, verifAdmin, superUser }) => {

    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }

    if (!verifAdmin && !superUser) {
        return repondre("⛔ *Administrator privileges required*");
    }

    const word = arg.join(" ").toLowerCase().trim();
    if (!word) {
        return repondre("❌ *Please specify a word to remove*\n\nExample: .delbadword example");
    }

    const groupBadWords = getBadWords(dest);
    const initialCount = groupBadWords.length;
    
    // Remove the word
    badWordsDB.set(dest, groupBadWords.filter(w => w !== word));
    
    const newCount = getBadWords(dest).length;
    
    if (newCount < initialCount) {
        await repondre(`✅ *BAD WORD REMOVED*\n\n• Word: "${word}"\n• Remaining words: ${newCount}`);
    } else {
        await repondre(`⚠️ *"${word}" was not found in the bad words list*`);
    }
});

// ==================== BAD WORD LIST COMMAND ====================
zokou({ 
    nomCom: "badwordlist", 
    categorie: "Group", 
    reaction: "📜" 
}, async (dest, zk, { repondre, verifGroupe }) => {

    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }

    const groupBadWords = getBadWords(dest);
    const isEnabled = antibadwordGroups.has(dest);
    const status = isEnabled ? "🟢 ACTIVE" : "🔴 INACTIVE";

    let wordList = "╭─⊷ *📜 𝗕𝗔𝗗 𝗪𝗢𝗥𝗗𝗦 𝗟𝗜𝗦𝗧* ⊶\n│\n";
    
    if (groupBadWords.length === 0) {
        wordList += "│   No bad words configured\n";
    } else {
        groupBadWords.forEach((word, index) => {
            wordList += `│   ${index + 1}. ${word}\n`;
        });
    }

    wordList += `│\n├─ *📊 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦*\n`;
    wordList += `│   • Status: ${status}\n`;
    wordList += `│   • Total Words: ${groupBadWords.length}\n`;
    wordList += `│   • Default Words: ${defaultBadWords.length}\n`;
    wordList += `│   • Custom Words: ${groupBadWords.length - defaultBadWords.length}\n`;
    wordList += `│\n╰─⊷ *𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗡𝗚 𝗚𝗥𝗢𝗨𝗣 𝗤𝗨𝗔𝗟𝗜𝗧𝗬* ⊶\n\n`;
    wordList += `ℹ️ *Note:* Words are stored in RAM memory and will be lost if bot restarts.`;

    await repondre(wordList);
});

// ==================== AUTO DETECTION LISTENER ====================
zokou({ 
    nomCom: "__antibadword_listener__" 
}, async (dest, zk, { msg, verifGroupe, auteurMessage, nomAuteurMessage }) => {

    if (!verifGroupe) return;
    if (!antibadwordGroups.has(dest)) return;

    const text = (
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        msg?.imageMessage?.caption ||
        ""
    ).toLowerCase();

    if (!text) return;

    const groupBadWords = getBadWords(dest);
    const detectedWords = groupBadWords.filter(word => text.includes(word));

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
        const warningMsg = `╭─⊷ *⚠️ 𝗕𝗔𝗗 𝗪𝗢𝗥𝗗 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗* ⊶
│
├─ *👤 𝗨𝗦𝗘𝗥*
│   • Name: ${nomAuteurMessage || 'Unknown'}
│   • ID: @${auteurMessage.split("@")[0]}
│
├─ *🚫 𝗢𝗙𝗙𝗘𝗡𝗦𝗜𝗩𝗘 𝗖𝗢𝗡𝗧𝗘𝗡𝗧*
│   • Detected Words: ${detectedWords.join(', ')}
│   • Action Taken: Message Deleted
│
├─ *📜 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦*
│   1. No offensive language
│   2. Respect all members
│   3. Maintain positive environment
│   4. Repeated violations lead to removal
│
╰─⊷ *𝗥𝗘𝗦𝗣𝗘𝗖𝗧 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *𝗪𝗔𝗥𝗡𝗜𝗡𝗚:* Further violations may result
in removal from the group.
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 *Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;

        await zk.sendMessage(dest, {
            text: warningMsg,
            mentions: [auteurMessage]
        });

    } catch (error) {
        console.error("Anti-badword error:", error);
    }
});

// ==================== RESET BAD WORDS COMMAND ====================
zokou({ 
    nomCom: "resetbadwords", 
    categorie: "Group", 
    reaction: "🔄" 
}, async (dest, zk, { repondre, verifGroupe, verifAdmin, superUser }) => {

    if (!verifGroupe) {
        return repondre("❌ *Group command only*");
    }

    if (!verifAdmin && !superUser) {
        return repondre("⛔ *Administrator privileges required*");
    }

    // Reset to default words only
    badWordsDB.set(dest, [...defaultBadWords]);
    
    await repondre(`🔄 *BAD WORDS RESET TO DEFAULTS*\n\n• Removed all custom words\n• Restored ${defaultBadWords.length} default words\n• Use .addbadword to add custom words again`);
});

console.log("✅ Anti-badword system loaded (RAM storage)");
