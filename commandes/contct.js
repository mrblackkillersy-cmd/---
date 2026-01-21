const { zokou } = require("../framework/zokou");

/* ===============================
   SIMPLE GENERAL COMMANDS
================================ */

zokou({
  nomCom: 'love',
  categorie: 'General',
  reaction: '❤️',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `*You came as an unexpected person in my life…  
Now you are the most important person in my life.  
I love you ❤️ forever and always.*`
  );
});


zokou({
  nomCom: 'getall',
  categorie: 'General',
  reaction: '👊',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(`*_Getting all members…_*`);
});


zokou({
  nomCom: 'go',
  categorie: 'General',
  reaction: '📄',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(`*I am alive — listening to you 💀*`);
});


/* ===============================
   CHANNELS & GROUPS
================================ */

zokou({
  nomCom: 'channel',
  categorie: 'General',
  reaction: '🪐',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `https://whatsapp.com/channel/0029VbAhAOJISTkRkIw3Sy1D`
  );
});


zokou({
  nomCom: 'channel1',
  categorie: 'General',
  reaction: '💠',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `Tap here to join my second channel  
https://whatsapp.com/channel/0029VbAhAOJISTkRkIw3Sy1D`
  );
});


zokou({
  nomCom: 'group1',
  categorie: 'General',
  reaction: '🗣',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `Join our group 👇  
https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76`
  );
});


zokou({
  nomCom: 'script',
  categorie: 'General',
  reaction: '💫',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `Support group 👇  
https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76`
  );
});


/* ===============================
   BOT INFO
================================ */

zokou({
  nomCom: 'blackkiller',
  categorie: 'General',
  reaction: '👻',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `*_YES — I AM HERE  
AI ASSISTANT DEVELOPED BY  
𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥_*`
  );
});


zokou({
  nomCom: 'vision',
  categorie: 'General',
  reaction: '🔎',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `*_Our mission is to let you enjoy your WhatsApp experience 🥰_*`
  );
});


zokou({
  nomCom: 'bot',
  categorie: 'General',
  reaction: '🤖',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(`*_YES BOSS — I AM LISTENING_*`);
});


zokou({
  nomCom: 'me',
  categorie: 'General',
  reaction: '📞',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(
    `Contact developer 👇  
https://wa.me/255681613368`
  );
});


/* ===============================
   PROBLEM / SUPPORT
================================ */

zokou({
  nomCom: 'problem',
  categorie: 'General',
  reaction: '💀',
  fromMe: true,
}, async (dest, zk, { repondre }) => {
  await repondre(`
⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷⫷
✨ POWERED BY 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 ✨
⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸⫸

📡 CHANNEL  
https://whatsapp.com/channel/0029VbAhAOJISTkRkIw3Sy1D

👥 GROUP  
https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76

💀 BLACK KILLER-XMD — NEVER DIE
`);
});
