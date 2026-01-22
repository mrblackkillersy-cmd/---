"use strict";

const { zokou } = require('../framework/zokou');
const axios = require("axios");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

const {
  isUserBanned, addUserToBanList, removeUserFromBanList
} = require("../bdd/banUser");

const {
  addGroupToBanList, isGroupBanned, removeGroupFromBanList
} = require("../bdd/banGroup");

const {
  isGroupOnlyAdmin, addGroupToOnlyAdminList, removeGroupFromOnlyAdminList
} = require("../bdd/onlyAdmin");

const {
  removeSudoNumber, addSudoNumber, issudo
} = require("../bdd/sudo");

const conf = require("../set");

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/* ===================== TELEGRAM STICKER ===================== */
zokou({ nomCom: "telesticker", categorie: "Mods" }, async (dest, zk, ctx) => {
  const { repondre, arg, nomAuteurMessage, superUser, ms } = ctx;

  if (!superUser) return repondre("❌ Mods only");
  if (!arg[0]) return repondre("❌ Provide telegram sticker link");

  const link = arg.join(" ");
  if (!link.includes("addstickers")) return repondre("❌ Invalid telegram sticker link");

  const name = link.split("/addstickers/")[1];
  const TOKEN = process.env.TG_TOKEN;
  if (!TOKEN) return repondre("❌ Telegram token missing");

  try {
    const api = `https://api.telegram.org/bot${TOKEN}/getStickerSet?name=${encodeURIComponent(name)}`;
    const res = await axios.get(api);

    const set = res.data.result;
    if (set.is_animated || set.is_video)
      return repondre("❌ Animated / video stickers not supported");

    await repondre(`📦 *${set.name}*\n🧩 Stickers: ${set.stickers.length}\n⏳ Downloading...`);

    for (const s of set.stickers) {
      const fileRes = await axios.get(
        `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${s.file_id}`
      );

      const filePath = fileRes.data.result.file_path;
      const buffer = await axios.get(
        `https://api.telegram.org/file/bot${TOKEN}/${filePath}`,
        { responseType: "arraybuffer" }
      );

      const sticker = new Sticker(buffer.data, {
        pack: nomAuteurMessage,
        author: "𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥",
        type: StickerTypes.FULL,
        quality: 70,
        id: Date.now().toString(),
      });

      await zk.sendMessage(dest, { sticker: await sticker.toBuffer() }, { quoted: ms });
      await sleep(1200);
    }
  } catch (e) {
    repondre("❌ Error: " + e.message);
  }
});

/* ===================== JOIN GROUP ===================== */
zokou({ nomCom: "join", categorie: "Mods" }, async (dest, zk, { arg, repondre, superUser }) => {
  if (!superUser) return repondre("❌ Owner only");
  if (!arg[0] || !arg[0].includes("chat.whatsapp.com"))
    return repondre("❌ Invalid group link");

  try {
    const code = arg[0].split("chat.whatsapp.com/")[1];
    await zk.groupAcceptInvite(code);
    repondre("✅ Joined group");
  } catch (e) {
    repondre("❌ Failed to join group");
  }
});

/* ===================== BLOCK / UNBLOCK ===================== */
zokou({ nomCom: "block", categorie: "Mods" }, async (dest, zk, ctx) => {
  const { repondre, superUser, msgRepondu, auteurMsgRepondu } = ctx;
  if (!superUser) return repondre("❌ Owner only");
  if (!msgRepondu) return repondre("❌ Reply to user");

  await zk.updateBlockStatus(auteurMsgRepondu, "block");
  repondre("✅ User blocked");
});

zokou({ nomCom: "unblock", categorie: "Mods" }, async (dest, zk, ctx) => {
  const { repondre, superUser, msgRepondu, auteurMsgRepondu } = ctx;
  if (!superUser) return repondre("❌ Owner only");
  if (!msgRepondu) return repondre("❌ Reply to user");

  await zk.updateBlockStatus(auteurMsgRepondu, "unblock");
  repondre("✅ User unblocked");
});

/* ===================== BAN USER ===================== */
zokou({ nomCom: "ban", categorie: "Mods" }, async (dest, zk, ctx) => {
  const { arg, repondre, msgRepondu, auteurMsgRepondu, superUser } = ctx;
  if (!superUser) return repondre("❌ Owner only");
  if (!msgRepondu) return repondre("❌ Reply to user");

  if (arg[0] === "add") {
    if (await isUserBanned(auteurMsgRepondu))
      return repondre("⚠️ Already banned");
    addUserToBanList(auteurMsgRepondu);
    repondre("✅ User banned");
  } else if (arg[0] === "del") {
    removeUserFromBanList(auteurMsgRepondu);
    repondre("✅ User unbanned");
  } else {
    repondre("❌ Use ban add / del");
  }
});

/* ===================== SUDO ===================== */
zokou({ nomCom: "sudo", categorie: "Mods" }, async (dest, zk, ctx) => {
  const { arg, repondre, msgRepondu, auteurMsgRepondu, superUser } = ctx;
  if (!superUser) return repondre("❌ Owner only");
  if (!msgRepondu) return repondre("❌ Reply to user");

  if (arg[0] === "add") {
    if (await issudo(auteurMsgRepondu))
      return repondre("⚠️ Already sudo");
    addSudoNumber(auteurMsgRepondu);
    repondre("✅ Added to sudo");
  } else if (arg[0] === "del") {
    removeSudoNumber(auteurMsgRepondu);
    repondre("✅ Removed from sudo");
  } else {
    repondre("❌ Use sudo add / del");
  }
});

/* ===================== ONLY ADMIN ===================== */
zokou({ nomCom: "onlyadmin", categorie: "Group" }, async (dest, zk, ctx) => {
  const { arg, repondre, verifGroupe, superUser, verifAdmin } = ctx;
  if (!verifGroupe) return repondre("❌ Group only");
  if (!superUser && !verifAdmin) return repondre("❌ Not allowed");

  if (arg[0] === "add") {
    addGroupToOnlyAdminList(dest);
    repondre("✅ Only-admin enabled");
  } else if (arg[0] === "del") {
    removeGroupFromOnlyAdminList(dest);
    repondre("✅ Only-admin disabled");
  } else {
    repondre("❌ Use onlyadmin add / del");
  }
});
