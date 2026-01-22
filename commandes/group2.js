const { zokou } = require('../framework/zokou');
const axios = require("axios");
let { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { isUserBanned, addUserToBanList, removeUserFromBanList } = require("../bdd/banUser");
const { addGroupToBanList, isGroupBanned, removeGroupFromBanList } = require("../bdd/banGroup");
const { isGroupOnlyAdmin, addGroupToOnlyAdminList, removeGroupFromOnlyAdminList } = require("../bdd/onlyAdmin");
const { removeSudoNumber, addSudoNumber, issudo } = require("../bdd/sudo");

const sleep = (ms) => {
  return new Promise((resolve) => { setTimeout(resolve, ms) });
};

// Telesticker Command
zokou({ nomCom: "telesticker", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;

  if (!superUser) {
    repondre('Only Mods can use this command');
    return;
  }

  if (!arg[0]) {
    repondre("put a telegram sticker link");
    return;
  }

  let lien = arg.join(' ');
  let name = lien.split('/addstickers/')[1];
  let api = 'https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=' + encodeURIComponent(name);

  try {
    let stickers = await axios.get(api);
    let type = null;

    if (stickers.data.result.is_animated === true || stickers.data.result.is_video === true) {
      type = 'animated sticker';
    } else {
      type = 'not animated sticker';
    }

    let msg = `Popkid-stickers-dl\n\n*Name:* ${stickers.data.result.name}\n*Type:* ${type}\n*Length:* ${(stickers.data.result.stickers).length}\n\nDownloading...`;
    await repondre(msg);

    for (let i = 0; i < (stickers.data.result.stickers).length; i++) {
      let file = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${stickers.data.result.stickers[i].file_id}`);
      let buffer = await axios({
        method: 'get',
        url: `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file.data.result.file_path}`,
        responseType: 'arraybuffer',
      });

      const sticker = new Sticker(buffer.data, {
        pack: nomAuteurMessage,
        author: "black killer",
        type: StickerTypes.FULL,
        categories: ['🤩', '🎉'],
        id: '12345',
        quality: 50,
        background: '#000000'
      });

      const stickerBuffer = await sticker.toBuffer();
      await zk.sendMessage(dest, { sticker: stickerBuffer }, { quoted: ms });
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// Create Group Command
zokou({ nomCom: "crew", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage, superUser, auteurMsgRepondu, msgRepondu } = commandeOptions;

  if (!superUser) {
    repondre("only mods can use this command");
    return;
  }

  if (!arg[0]) {
    repondre('Please enter the name of the group to create');
    return;
  }
  
  if (!msgRepondu) {
    repondre('Please mention a member to add');
    return;
  }

  try {
    const name = arg.join(" ");
    const group = await zk.groupCreate(name, [auteurMessage, auteurMsgRepondu]);
    await zk.sendMessage(group.id, { text: `Welcome to ${name}` });
    repondre(`Group created successfully with ID: ${group.gid}`);
  } catch (e) {
    repondre('Error creating group: ' + e.message);
  }
});

// Leave Group Command
zokou({ nomCom: "left", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, superUser } = commandeOptions;
  
  if (!verifGroupe) {
    repondre("group only");
    return;
  }
  
  if (!superUser) {
    repondre("order reserved for the owner");
    return;
  }

  try {
    await zk.groupLeave(dest);
    repondre("Left the group successfully");
  } catch (e) {
    repondre("Error leaving group: " + e.message);
  }
});

// Join Group Command (fixed version)
zokou({ nomCom: "join", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, superUser } = commandeOptions;

  if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }

  if (!arg[0]) {
    repondre("Please provide a WhatsApp group link");
    return;
  }

  try {
    let inviteCode = arg[0].split('https://chat.whatsapp.com/')[1];
    await zk.groupAcceptInvite(inviteCode);
    repondre('Successfully joined the group');
  } catch (e) {
    repondre('Error joining group: ' + e.message);
  }
});

// Get JID Command
zokou({ nomCom: "jid", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgRepondu, superUser, auteurMsgRepondu } = commandeOptions;

  if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }

  let jid;
  if (!msgRepondu) {
    jid = dest;
  } else {
    jid = auteurMsgRepondu;
  }
  
  zk.sendMessage(dest, { text: jid }, { quoted: ms });
});

// Block User Command (fixed version)
zokou({ nomCom: "block", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, msgRepondu, superUser, auteurMsgRepondu } = commandeOptions;

  if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }

  try {
    let jid;
    if (!msgRepondu) {
      if (verifGroupe) {
        repondre('Be sure to mention the person to block');
        return;
      }
      jid = dest;
    } else {
      jid = auteurMsgRepondu;
    }

    await zk.updateBlockStatus(jid, "block");
    repondre('User blocked successfully');
  } catch (e) {
    repondre('Error blocking user: ' + e.message);
  }
});

// Unblock User Command (fixed version)
zokou({ nomCom: "unblock", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, msgRepondu, superUser, auteurMsgRepondu } = commandeOptions;

  if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }

  try {
    let jid;
    if (!msgRepondu) {
      if (verifGroupe) {
        repondre('Please mention the person to be unlocked');
        return;
      }
      jid = dest;
    } else {
      jid = auteurMsgRepondu;
    }

    await zk.updateBlockStatus(jid, "unblock");
    repondre('User unblocked successfully');
  } catch (e) {
    repondre('Error unblocking user: ' + e.message);
  }
});

// Ban User Command
zokou({ nomCom: 'ban', categorie: 'Mods' }, async (dest, zk, commandeOptions) => {
  const { ms, arg, auteurMsgRepondu, msgRepondu, repondre, prefixe, superUser } = commandeOptions;

  if (!superUser) {
    repondre('This command is only allowed to the bot owner');
    return;
  }

  if (!arg[0]) {
    repondre(`Mention the victim by typing ${prefixe}ban add/del to ban/unban the victim`);
    return;
  }

  if (!msgRepondu) {
    repondre('Mention the victim');
    return;
  }

  try {
    switch (arg[0]) {
      case 'add':
        let youareban = await isUserBanned(auteurMsgRepondu);
        if (youareban) {
          repondre('This user is already banned');
          return;
        }
        addUserToBanList(auteurMsgRepondu);
        repondre('User banned successfully');
        break;

      case 'del':
        let estbanni = await isUserBanned(auteurMsgRepondu);
        if (estbanni) {
          removeUserFromBanList(auteurMsgRepondu);
          repondre('This user is now free.');
        } else {
          repondre('This user is not banned.');
        }
        break;

      default:
        repondre('Bad option. Use "add" or "del"');
        break;
    }
  } catch (e) {
    repondre('Error: ' + e.message);
  }
});

// Ban Group Command
zokou({ nomCom: 'bangroup', categorie: 'Mods' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, prefixe, superUser, verifGroupe } = commandeOptions;

  if (!superUser) {
    repondre('This command is only allowed to the bot owner');
    return;
  }

  if (!verifGroupe) {
    repondre('Order reservation for groups');
    return;
  }

  if (!arg[0]) {
    repondre(`Type ${prefixe}bangroup add/del to ban/unban the group`);
    return;
  }

  try {
    const groupalreadyBan = await isGroupBanned(dest);

    switch (arg[0]) {
      case 'add':
        if (groupalreadyBan) {
          repondre('This group is already banned');
          return;
        }
        addGroupToBanList(dest);
        repondre('Group banned successfully');
        break;

      case 'del':
        if (groupalreadyBan) {
          removeGroupFromBanList(dest);
          repondre('This group is now free.');
        } else {
          repondre('This group is not banned.');
        }
        break;

      default:
        repondre('Bad option. Use "add" or "del"');
        break;
    }
  } catch (e) {
    repondre('Error: ' + e.message);
  }
});

// Only Admin Mode Command
zokou({ nomCom: 'onlyadmin', categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, prefixe, superUser, verifGroupe, verifAdmin } = commandeOptions;

  if (!superUser && !verifAdmin) {
    repondre('You are not entitled to this order');
    return;
  }

  if (!verifGroupe) {
    repondre('Order reservation for groups');
    return;
  }

  if (!arg[0]) {
    repondre(`Type ${prefixe}onlyadmin add/del to enable/disable onlyadmin mode`);
    return;
  }

  try {
    const groupalreadyOnlyAdmin = await isGroupOnlyAdmin(dest);

    switch (arg[0]) {
      case 'add':
        if (groupalreadyOnlyAdmin) {
          repondre('This group is already in onlyadmin mode');
          return;
        }
        addGroupToOnlyAdminList(dest);
        repondre('Only admin mode enabled');
        break;

      case 'del':
        if (groupalreadyOnlyAdmin) {
          removeGroupFromOnlyAdminList(dest);
          repondre('Only admin mode disabled.');
        } else {
          repondre('This group is not in onlyadmin mode.');
        }
        break;

      default:
        repondre('Bad option. Use "add" or "del"');
        break;
    }
  } catch (e) {
    repondre('Error: ' + e.message);
  }
});

// Sudo Command
zokou({ nomCom: 'sudo', categorie: 'Mods' }, async (dest, zk, commandeOptions) => {
  const { arg, auteurMsgRepondu, msgRepondu, repondre, prefixe, superUser } = commandeOptions;

  if (!superUser) {
    repondre('This command is only allowed to the bot owner');
    return;
  }

  if (!arg[0]) {
    repondre(`Mention the person by typing ${prefixe}sudo add/del`);
    return;
  }

  if (!msgRepondu) {
    repondre('Mention the user');
    return;
  }

  try {
    switch (arg[0]) {
      case 'add':
        let youaresudo = await issudo(auteurMsgRepondu);
        if (youaresudo) {
          repondre('This user is already sudo');
          return;
        }
        addSudoNumber(auteurMsgRepondu);
        repondre('User added to sudo list successfully');
        break;

      case 'del':
        let estsudo = await issudo(auteurMsgRepondu);
        if (estsudo) {
          removeSudoNumber(auteurMsgRepondu);
          repondre('This user is now non-sudo.');
        } else {
          repondre('This user is not sudo.');
        }
        break;

      default:
        repondre('Bad option. Use "add" or "del"');
        break;
    }
  } catch (e) {
    repondre('Error: ' + e.message);
  }
});

// Save Message Command
zokou({ nomCom: "save", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, superUser, auteurMessage } = commandeOptions;

  if (!superUser) {
    repondre('only mods can use this command');
    return;
  }

  if (!msgRepondu) {
    repondre('Mention the message that you want to save');
    return;
  }

  try {
    let msg;
    if (msgRepondu.imageMessage) {
      let media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
      msg = {
        image: { url: media },
        caption: msgRepondu.imageMessage.caption,
      };
    } else if (msgRepondu.videoMessage) {
      let media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
      msg = {
        video: { url: media },
        caption: msgRepondu.videoMessage.caption,
      };
    } else if (msgRepondu.audioMessage) {
      let media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
      msg = {
        audio: { url: media },
        mimetype: 'audio/mp4',
      };
    } else if (msgRepondu.stickerMessage) {
      let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
      let stickerMess = new Sticker(media, {
        pack: '𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻',
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent",
      });
      const stickerBuffer2 = await stickerMess.toBuffer();
      msg = { sticker: stickerBuffer2 };
    } else if (msgRepondu.conversation) {
      msg = {
        text: msgRepondu.conversation,
      };
    } else {
      repondre('Unsupported message type');
      return;
    }

    await zk.sendMessage(auteurMessage, msg);
    repondre('Message saved successfully');
  } catch (e) {
    repondre('Error saving message: ' + e.message);
  }
});

// Mention Command
zokou({ nomCom: 'mention', categorie: 'Mods' }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, superUser, arg } = commandeOptions;

  if (!superUser) {
    repondre('you do not have the rights for this command');
    return;
  }

  const mbdd = require('../bdd/mention');
  let alldata = await mbdd.recupererToutesLesValeurs();

  if (!arg || arg.length < 1) {
    if (alldata.length === 0) {
      repondre(`To activate or modify the mention; follow this syntax: mention link type message
The different types are audio, video, image, and sticker.
Example: mention https://static.animecorner.me/2023/08/op2.jpg image Hi, my name is popkid`);
      return;
    }

    let data = alldata[0];
    let etat = data.status == 'non' ? 'Deactivated' : 'Activated';
    let mtype = data.type || 'no data';
    let url = data.url || 'no data';

    let msg = `Status: ${etat}
Type: ${mtype}
Link: ${url}

*Instructions:*
To activate or modify the mention, follow this syntax: mention link type message
The different types are audio, video, image, and sticker.
Example: mention https://static.animecorner.me/2023/08/op2.jpg image Hi, my name is popkid

To stop the mention, use mention stop`;

    repondre(msg);
    return;
  }

  try {
    if (arg.length >= 2) {
      if (arg[0].startsWith('http') && (arg[1] == 'image' || arg[1] == 'audio' || arg[1] == 'video' || arg[1] == 'sticker')) {
        let args = [];
        for (let i = 2; i < arg.length; i++) {
          args.push(arg[i]);
        }
        let message = args.join(' ') || '';

        await mbdd.addOrUpdateDataInMention(arg[0], arg[1], message);
        await mbdd.modifierStatusId1('oui');
        repondre('Mention updated successfully');
      } else {
        repondre(`*Instructions:*
To activate or modify the mention, follow this syntax: mention link type message. The different types are audio, video, image, and sticker.`);
      }
    } else if (arg.length === 1 && arg[0] == 'stop') {
      await mbdd.modifierStatusId1('non');
      repondre('Mention stopped');
    } else {
      repondre('Please make sure to follow the instructions');
    }
  } catch (e) {
    repondre('Error: ' + e.message);
  }
});
