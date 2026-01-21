const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
  {
    nomCom: 'alive',
    categorie: 'General'
  },
  async (dest, zk, commandeOptions) => {

    const { ms, arg, repondre, superUser } = commandeOptions;
    const data = await getDataFromAlive();

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

        const alivemsg = `
*Owner* : ${s.OWNER_NAME}
*Mode* : ${mode}
*Date* : ${date}
*Hours(GMT)* : ${temps}

${message}

*𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻-𝚆𝙰𝙱𝙾𝚃*`;

        if (lien.match(/\.(mp4|gif)$/i)) {
          zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
          zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
        } else {
          repondre(alivemsg);
        }

      } else {
        if (!superUser) {
          return repondre("there is no alive for this bot");
        }

        await repondre(
          "You have not yet saved your alive, use:\n.alive message;image_or_video_link"
        );
        repondre("don't do fake things :)");
      }

    } else {

      if (!superUser) {
        return repondre("Only the owner can modify the alive");
      }

      const texte = arg.join(' ').split(';')[0];
      const tlien = arg.join(' ').split(';')[1];

      await addOrUpdateDataInAlive(texte, tlien);

      repondre(' *𝔹𝕃𝔸ℂ𝕂 𝕂𝕀𝕃𝕃𝔼ℝ-𝕏𝕄𝔻 ALWAYS IS ALIVE* ');
    }
  }
);
