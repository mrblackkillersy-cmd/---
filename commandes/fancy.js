const { zokou } = require("../framework/zokou");
const fancy = require("../bmw/style");

zokou({
  nomCom: "fancy",
  categorie: "Fun",
  reaction: "🔖"
}, async (dest, zk, commandeOptions) => {

  const { arg, repondre, prefixe } = commandeOptions;
  const prefix = prefixe || '.';

  const id = arg[0]?.match(/\d+/)?.[0];
  const text = arg.slice(1).join(" ");

  try {
    if (!id || !text || text.trim().length === 0) {
      return await repondre(
        `\nExample : ${prefix}fancy 10 Goodchild-Xmd\n` +
        String.fromCharCode(8206).repeat(4001) +
        fancy.list('GOODCHILD-XMD')
      );
    }

    const selectedStyle = fancy[parseInt(id) - 1];

    if (!selectedStyle) {
      return await repondre('_Style introuvable :(_');
    }

    return await repondre(
      fancy.apply(selectedStyle, text)
    );

  } catch (error) {
    console.error("FANCY ERROR:", error);
    return await repondre('_Une erreur s\'est produite :(_');
  }
});
