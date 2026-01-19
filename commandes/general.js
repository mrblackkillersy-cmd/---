const { zokou } = require("../framework/zokou");
const {getAllSudoNumbers,isSudoTableNotEmpty} = require("../bdd/sudo")
const conf = require("../set");

zokou({ nomCom: "owner", categorie: "General", reaction: "🎓" }, async (dest, zk, commandeOptions) => {
    const { ms , mybotpic } = commandeOptions;
    
  const thsudo = await isSudoTableNotEmpty()

  if (thsudo) {
     let msg = `*My Super-User*\n
     *Owner Number*\n :
- 🌟 @${conf.NUMERO_OWNER}

------ *other sudos* -----\n`
     
 let sudos = await getAllSudoNumbers()

   for ( const sudo of sudos) {
    if (sudo) { // Vérification plus stricte pour éliminer les valeurs vides ou indéfinies
      sudonumero = sudo.replace(/[^0-9]/g, '');
      msg += `- 💼 @${sudonumero}\n`;
    } else {return}

   }   const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net";
   const mentionedJid = sudos.concat([ownerjid])
   console.log(sudos);
   console.log(mentionedJid)
      zk.sendMessage(
        dest,
        {
          image : { url : mybotpic() },
          caption : msg,
          mentions : mentionedJid
        }
      )
  } else {
    const vcard =
        'BEGIN:VCARD\n' + // metadata of the contact card
        'VERSION:3.0\n' +
        'FN:' + conf.OWNER_NAME + '\n' + // full name
        'ORG:undefined;\n' + // the organization of the contact
        'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' + // WhatsApp ID + phone number
        'END:VCARD';
    zk.sendMessage(dest, {
        contacts: {
            displayName: conf.OWNER_NAME,
            contacts: [{ vcard }],
        },
    },{quoted:ms});
  }
});

zokou({ nomCom: "dev", categorie: "General", reaction: "🥰" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
      { nom: "𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 ", numero: "255681613368" },
       // Ajoute d'autres développeurs ici avec leur nom et numéro
    ];

    let message = "𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝚃𝙾 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻  𝙷𝙴𝙻𝙿 𝙲𝙴𝙽𝚃𝙴𝚁! 𝙰𝚂𝙺 𝙵𝙾𝙴 𝙷𝙴𝙻𝙿 𝙵𝙴𝙾𝙼 𝙰𝙽𝚈 𝙾𝙵 𝚃𝙷𝙴 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁𝚂 𝙱𝙴𝙻𝙾𝚆:\n\n";
    for (const dev of devs) {
      message += `----------------\n• ${dev.nom} : https://wa.me/${dev.numero}\n`;
    }
  var lien = mybotpic()
    if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:message }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:message }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {
    repondre(lien)
    repondre("link error");
    
}
});

zokou({ nomCom: "support", categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteurMessage, } = commandeOptions; 
 
  repondre("THANK YOU FOR CHOOSING 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 , HERE ARE OUR SUPPORTIVE LINKS\n\n ☉ CHANNEL 1 LINK IS HERE ☉ \n\n❒⁠⁠⁠⁠[https://whatsapp.com/channel/0029VbAhAOJISTkRkIw3Sy1D] \n\n ☉ CHANNEL 2 LINK IS HERE ☉\n\n❒⁠⁠⁠⁠[https://whatsapp.com/channel/0029VbAhAOJISTkRkIw3Sy1D] \n\n ☉GROUP LINK IS HERE ☉\n\n❒⁠⁠⁠⁠[https://chat.whatsapp.com/GgvYBezrmKLKJTllr7dD76] \n\n\n𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝙱𝚢 𝗠𝗥 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥") 
  await zk.sendMessage(auteurMessage,{text : `THANK YOU FOR CHOOSING 𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 ,MAKE SURE YOU FOLLOW THESE LINKS. `},{quoted :ms})

})
