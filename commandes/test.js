"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "test",
  categorie: "General",
  reaction: "🚀",
  nomFichier: __filename
}, async (dest, zk, commandeOptions) => {

  const { ms } = commandeOptions;

  console.log("Commande saisie !!!");

  let z = 'Hello my name is *𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻*\n\n';
  let d = "i'm a WhatsApp multi-device bot created by *𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻*";
  let varmess = z + d;

  let img = 'https://files.catbox.moe/dxvvk7.jpg';

  await zk.sendMessage(
    dest,
    { image: { url: img }, caption: varmess },
    { quoted: ms }
  );
});

console.log("mon test");
