const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const fs = require("fs");

const DEVELOPER_NAME = "𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥";
const DEVELOPER_NUMBER = "255681613368";
const BOT_NAME = "𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 𝗫𝗠𝗗";
const VERSION = "v3.5.0";

zokou({
  nomCom: "aboutbot",
  categorie: "Owner",
  reaction: "🎛️",
  desc: "Show advanced bot identity, system status, and developer info"
}, async (messageId, chatId, { repondre, ms }) => {
  
  // Get system information
  const totalRAM = (os.totalmem() / (1024 ** 3)).toFixed(2);
  const freeRAM = (os.freemem() / (1024 ** 3)).toFixed(2);
  const usedRAM = (totalRAM - freeRAM).toFixed(2);
  const uptime = process.uptime();
  
  // Format uptime
  const days = Math.floor(uptime / (3600 * 24));
  const hours = Math.floor((uptime % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  let uptimeStr = "";
  if (days > 0) uptimeStr += `${days}d `;
  if (hours > 0) uptimeStr += `${hours}h `;
  if (minutes > 0) uptimeStr += `${minutes}m `;
  uptimeStr += `${seconds}s`;
  
  // Get time
  moment.tz.setDefault("Africa/Tanzania");
  const currentTime = moment().format('HH:mm:ss');
  const currentDate = moment().format('DD/MM/YYYY');
  
  // Count commands
  let commandCount = 0;
  try {
    const commandsDir = __dirname + "/../commandes";
    const files = fs.readdirSync(commandsDir);
    commandCount = files.filter(file => file.endsWith('.js')).length;
  } catch (e) {
    commandCount = 45; // Default fallback
  }
  
  const msg = `
╭─⊷ *🅱︎🅻︎🅰︎🅲︎🅺︎ 🅺︎🅸︎🅻︎🅻︎🅴︎🆁︎ 🆇🅼🅳* ⊶
│
├─ *🤖 BOT IDENTITY*
│  • Name: ${BOT_NAME}
│  • Version: ${VERSION}
│  • AI: GPT-4 Powered
│  • Languages: 🇹🇿 Kiswahili | 🇬🇧 English
│  • Status: 🟢 ONLINE
│
├─ *⚙️ SYSTEM STATUS*
│  • Uptime: ${uptimeStr}
│  • RAM: ${usedRAM}GB / ${totalRAM}GB
│  • Platform: ${os.platform()} ${os.arch()}
│  • CPU: ${os.cpus().length} Core${os.cpus().length > 1 ? 's' : ''}
│  • Commands: ${commandCount}+
│  • Time: ${currentTime}
│  • Date: ${currentDate}
│
├─ *🎯 CORE FEATURES*
│  ✅ Advanced AI Chat System
│  ✅ Multi-language Support
│  ✅ APK Download Manager
│  ✅ Weather Forecast System
│  ✅ Media Processing Tools
│  ✅ Group Management
│  ✅ Auto-Update System
│  ✅ Encryption/Decryption
│  ✅ User Activity Tracking
│
├─ *🔐 SECURITY SYSTEM*
│  • Developer: ${DEVELOPER_NAME}
│  • Control: Owner-Only Commands
│  • Protection: Anti-Spam Filter
│  • Auth: Number Verification
│  • Logs: Activity Monitoring
│
├─ *📞 CONTACT & SUPPORT*
│  • Developer: ${DEVELOPER_NAME}
│  • WhatsApp: https://wa.me/${DEVELOPER_NUMBER}
│  • Status: 24/7 Available
│  • Support: Premium Technical
│
╰─⊷ *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙼𝚁 𝙱𝙻𝙰𝙲𝙺 𝙺𝙸𝙻𝙻𝙴𝚁* ⊶

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🔥 EXCLUSIVE COMMANDS:*
• .black - Developer panel
• .memberstatus - Group analytics
• .devpanel - System control
• .mybrand - Brand showcase
• .brag - Achievement display
• .updates - Latest features
• .stats - Performance metrics
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*⚠️ WARNING:* This bot is protected by ${DEVELOPER_NAME}
Unauthorized access or misuse is strictly prohibited.

*💎 LEGACY:* Every response carries the signature of ${DEVELOPER_NAME}

📊 *Real-time Monitoring:* Active
🛡️ *Security Level:* MAXIMUM
⚡ *Performance:* OPTIMIZED

🎯 *MISSION:* Revolutionizing WhatsApp automation since 2024
`;

  // Send with formatting
  await repondre({
    text: msg,
    contextInfo: {
      externalAdReply: {
        title: `⚡ ${BOT_NAME} ⚡`,
        body: `Advanced WhatsApp Bot | Version ${VERSION}`,
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: true,
        thumbnailUrl: "https://i.imgur.com/7XrYC5p.jpg", // You can replace with your image
        sourceUrl: `https://wa.me/${DEVELOPER_NUMBER}`
      }
    }
  });
});

// Optional: Add more commands in the same file
zokou({
  nomCom: "black",
  categorie: "Owner",
  reaction: "⚡",
  desc: "Developer control panel"
}, async (messageId, chatId, { repondre }) => {
  const panel = `
╭─⊷ *𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗣𝗔𝗡𝗘𝗟* ⊶
│
├─ *🔧 SYSTEM CONTROLS*
│  • Restart Bot
│  • Update Commands
│  • Clear Cache
│  • View Logs
│
├─ *📊 STATISTICS*
│  • Active Users: 1,234
│  • Commands Today: 456
│  • Groups: 78
│  • Uptime: 99.8%
│
├─ *⚙️ QUICK ACTIONS*
│  • .update - Force update
│  • .backup - Backup data
│  • .logs - View system logs
│  • .users - List all users
│
╰─⊷ *𝗔𝗖𝗖𝗘𝗦𝗦: 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗢𝗡𝗟𝗬* ⊶

📞 Contact: https://wa.me/${DEVELOPER_NUMBER}
`;
  
  await repondre(panel);
});

zokou({
  nomCom: "mybrand",
  categorie: "Owner", 
  reaction: "💎",
  desc: "Showcase MR BLACK KILLER brand"
}, async (messageId, chatId, { repondre }) => {
  const brand = `
╭─⊷ *𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 𝗕𝗥𝗔𝗡𝗗* ⊶
│
│ *🎯 VISION:*
│ Revolutionizing digital automation with
│ cutting-edge technology and premium
│ user experience.
│
│ *💎 VALUES:*
│ • Innovation
│ • Excellence  
│ • Reliability
│ • Security
│ • Professionalism
│
│ *🚀 SERVICES:*
│ • Custom WhatsApp Bots
│ • AI Integration
│ • System Automation
│ • Security Solutions
│ • 24/7 Support
│
│ *🏆 ACHIEVEMENTS:*
│ • 1000+ Active Users
│ • 99.8% Uptime
│ • 45+ Commands
│ • Multi-language Support
│ • Advanced AI Features
│
╰─⊷ *𝗧𝗛𝗘 𝗠𝗔𝗥𝗞 𝗢𝗙 𝗘𝗫𝗖𝗘𝗟𝗟𝗘𝗡𝗖𝗘* ⊶

📱 *Contact:* https://wa.me/${DEVELOPER_NUMBER}
🌐 *Legacy:* Since 2024
⚡ *Powered by innovation*
`;
  
  await repondre(brand);
});
