const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
  {
    nomCom: 'alive',
    alias: ['ping', 'bot', 'online'],
    categorie: 'General',
    reaction: '🤖'
  },
  async (dest, zk, commandeOptions) => {

    const { ms, arg, repondre, superUser, auteurMessage } = commandeOptions;
    const data = await getDataFromAlive();

    // AUDIO URL - Sasa itatumika kila wakati
    const welcomeAudio = "https://files.catbox.moe/0lpz0p.mp3";

    if (!arg || !arg[0] || arg.join('') === '') {

      if (data) {
        const { message, lien } = data;

        let mode = "public";
        if ((s.MODE).toLocaleLowerCase() != "yes") {
          mode = "private";
        }

        moment.tz.setDefault('Etc/GMT');
        const temps = moment().format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');
        const dayName = moment().format('dddd');

        // CREATIVE ALIVE MESSAGE DESIGN
        const alivemsg = `
╔═══════════════════════╗
       𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═══════════════════════╝

╭─「 📋 *BOT INFO* 」
│ ✦ *Owner* : ${s.OWNER_NAME}
│ ✦ *Mode* : ${mode.toUpperCase()}
│ ✦ *Status* : ✅ ONLINE & ACTIVE
╰───────────────────

╭─「 📅 *SYSTEM INFO* 」
│ ✦ *Date* : ${date}
│ ✦ *Day* : ${dayName}
│ ✦ *Time* : ${temps} (GMT)
│ ✦ *Uptime* : ${process.uptime().toFixed(0)}s
╰───────────────────

╭─「 💬 *MESSAGE* 」
│ ${message}
╰───────────────────

╭─「 🎵 *NOW PLAYING* 」
│ 🔊 Welcome Audio Playing...
│ 📍 *Bot Powered by*: 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╰───────────────────

*Type .menu to see all commands*`;

        try {
          // SENDA AUDIO FIRST
          await zk.sendMessage(dest, {
            audio: { url: welcomeAudio },
            mimetype: 'audio/mp4',
            ptt: false
          });

          // THEN SEND THE ALIVE MESSAGE
          if (lien && lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, { 
              video: { url: lien }, 
              caption: alivemsg 
            }, { quoted: ms });
          } else if (lien && lien.match(/\.(jpeg|png|jpg|webp)$/i)) {
            await zk.sendMessage(dest, { 
              image: { url: lien }, 
              caption: alivemsg 
            }, { quoted: ms });
          } else {
            await zk.sendMessage(dest, { 
              text: alivemsg 
            }, { quoted: ms });
          }

          // SEND BOT CREDIT
          await zk.sendMessage(dest, {
            text: `🤖 *Bot is alive and kicking!*\n\n` +
                  `_Response time: ${Date.now() - ms.messageTimestamp * 1000}ms_\n` +
                  `📍 *Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻\n` +
                  `© ${new Date().getFullYear()} All rights reserved`
          });

        } catch (error) {
          console.error("Alive command error:", error);
          repondre("❌ Error sending alive message");
        }

      } else {
        if (!superUser) {
          // DEFAULT ALIVE FOR REGULAR USERS
          moment.tz.setDefault('Etc/GMT');
          const temps = moment().format('HH:mm:ss');
          const date = moment().format('DD/MM/YYYY');

          const defaultAlive = `
╔═══════════════════════╗
       𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═══════════════════════╝

╭─「 🟢 *BOT STATUS* 」
│ ✅ *Status*: ONLINE
│ ⚡ *Response*: ACTIVE
│ 🤖 *Version*: 2.0
╰───────────────────

╭─「 📊 *SYSTEM* 」
│ 📅 *Date*: ${date}
│ 🕐 *Time*: ${temps}
│ 🖥️ *Platform*: Linux 
╰───────────────────

╭─「 🎵 *AUDIO PLAYING* 」
│ 🔊 Welcome sound activated!
╰───────────────────

*Bot Creator:* ${s.OWNER_NAME}
*Powered by:* 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻`;

          try {
            // Send audio
            await zk.sendMessage(dest, {
              audio: { url: welcomeAudio },
              mimetype: 'audio/mp4',
              ptt: false
            });

            // Send default alive message
            await repondre(defaultAlive);

          } catch (error) {
            repondre("🤖 Bot is alive and working!");
          }
          return;
        }

        // FOR OWNER - SETUP GUIDE
        const setupGuide = `
╔═══════════════════════╗
   𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═══════════════════════╝

📋 *SETUP YOUR ALIVE MESSAGE*

You haven't set up your alive message yet!

*Usage:*
.alive message;image_or_video_link

*Examples:*
1. .alive Hello World!;https://example.com/image.jpg
2. .alive Bot is running smoothly;https://example.com/video.mp4

*Features:*
• Custom message
• Image/Video support
• Automatic audio welcome
• Stylish formatting

*Default audio will always play when users use .alive command*`;

        await repondre(setupGuide);
      }

    } else {

      if (!superUser) {
        return repondre("❌ Only the bot owner can modify the alive message!");
      }

      const input = arg.join(' ');
      const parts = input.split(';');
      const texte = parts[0] || "Bot is alive and running!";
      const tlien = parts[1] || "";

      if (!texte.trim()) {
        return repondre("❌ Please provide a message!");
      }

      try {
        await addOrUpdateDataInAlive(texte, tlien);

        // CONFIRMATION MESSAGE WITH STYLE
        const confirmationMsg = `
╔═══════════════════════╗
   𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═══════════════════════╝

✅ *ALIVE MESSAGE UPDATED!*

╭─「 📝 *MESSAGE SET* 」
│ ${texte}
╰───────────────────

${tlien ? `╭─「 🖼️ *MEDIA SET* 」\n│ ${tlien}\n╰───────────────────\n` : ''}

╭─「 🎵 *AUDIO* 」
│ 🔊 Welcome audio is set
│ 📍 Users will hear it on .alive
╰───────────────────

*Alive message has been saved successfully!*
Users will now see this when they type .alive`;

        await repondre(confirmationMsg);

        // Test the new alive message
        await zk.sendMessage(dest, {
          audio: { url: welcomeAudio },
          mimetype: 'audio/mp4',
          ptt: false
        });

        await zk.sendMessage(dest, {
          text: `🎉 *Test successful!*\nYour new alive message is now active.\n\nTry it with: .alive`
        });

      } catch (error) {
        console.error("Error updating alive:", error);
        repondre("❌ Failed to update alive message. Please try again.");
      }
    }
  }
);

// ALIVE TEST COMMAND (For quick check)
zokou(
  {
    nomCom: 'ping',
    alias: ['test', 'speed'],
    categorie: 'General',
    reaction: '🏓'
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    
    const startTime = Date.now();
    const welcomeAudio = "https://files.catbox.moe/0lpz0p.mp3";
    
    try {
      // Send audio
      await zk.sendMessage(dest, {
        audio: { url: welcomeAudio },
        mimetype: 'audio/mp4',
        ptt: false
      });
      
      const pingTime = Date.now() - startTime;
      
      const pingMsg = `
╔═══════════════════════╗
   𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻
╚═══════════════════════╝

╭─「 🏓 *PONG!* 」
│ ⚡ *Response Time*: ${pingTime}ms
│ ✅ *Status*: ACTIVE
│ 🔊 *Audio*: PLAYING
╰───────────────────

╭─「 📊 *SYSTEM* 」
│ 🖥️ *Uptime*: ${process.uptime().toFixed(0)}s
│ 📦 *Memory*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
╰───────────────────

*Bot is running smoothly!*`;
      
      await repondre(pingMsg);
      
    } catch (error) {
      await repondre(`🏓 Pong! Response: ${Date.now() - ms.messageTimestamp * 1000}ms\n\nAudio might not play due to network.`);
    }
  }
);
