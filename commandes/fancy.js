const { zokou } = require("../framework/zokou");

// CUSTOM FANCY TEXT STYLES
const fancyStyles = {
  list: (text = "BLACK-KILLER-XMD") => {
    let stylesList = "🎨 *FANCY TEXT GENERATOR*\n\n";
    stylesList += "*Usage:* .fancy [number] [text]\n\n";
    stylesList += "*Available Styles:*\n\n";
    
    // Add all styles with preview
    Object.keys(fancyStyles).forEach((key, index) => {
      if (key !== 'list' && key !== 'apply') {
        const styleNum = index; // Since we start from 0
        stylesList += `${styleNum + 1}. ${fancyStyles[key](text)}\n`;
      }
    });
    
    stylesList += `\n*Example:* .fancy 1 BLACK-KILLER-XMD`;
    return stylesList;
  },
  
  apply: (styleId, text) => {
    const styles = [
      "𝖇𝖑𝖆𝖈𝖐-𝖐𝖎𝖑𝖑𝖊𝖗-𝖝𝖒𝖉",
      "𝕓𝕝𝕒𝕔𝕜-𝕜𝕚𝕝𝕝𝕖𝕣-𝕩𝕞𝕕",
      "𝐛𝐥𝐚𝐜𝐤-𝐤𝐢𝐥𝐥𝐞𝐫-𝐱𝐦𝐝",
      "𝒷𝓁𝒶𝒸𝓀-𝓀𝒾𝓁𝓁𝑒𝓇-𝓍𝓂𝒹",
      "𝔟𝔩𝔞𝔠𝔨-𝔨𝔦𝔩𝔩𝔢𝔯-𝔵𝔪𝔡",
      "𝙗𝙡𝙖𝙘𝙠-𝙠𝙞𝙡𝙡𝙚𝙧-𝙭𝙢𝙙",
      "𝗯𝗹𝗮𝗰𝗸-𝗸𝗶𝗹𝗹𝗲𝗿-𝘅𝗺𝗱",
      "𝘣𝘭𝘢𝘤𝘬-𝘬𝘪𝘭𝘭𝘦𝘳-𝘹𝘮𝘥",
      "𝚋𝚕𝚊𝚌𝚔-𝚔𝚒𝚕𝚕𝚎𝚛-𝚡𝚖𝚍",
      "🅑🅛🅐🅒🅚-🅚🅘🅛🅛🅔🅡-🅧🅜🅓",
      "ⓑⓛⓐⓒⓚ-ⓚⓘⓛⓛⓔⓡ-ⓧⓜⓓ",
      "【b】【l】【a】【c】【k】【-】【k】【i】【l】【l】【e】【r】【-】【x】【m】【d】",
      "ᵇˡᵃᶜᵏ⁻ᵏⁱˡˡᵉʳ⁻ˣᵐᵈ",
      "ＢＬＡＣＫ－ＫＩＬＬＥＲ－ＸＭＤ",
      "🄱🄻🄰🄲🄺-🄺🄸🄻🄻🄴🅁-🅇🄼🄳",
      "b҉l҉a҉c҉k҉-҉k҉i҉l҉l҉e҉r҉-҉x҉m҉d҉",
      "b⃠l⃠a⃠c⃠k⃠-⃠k⃠i⃠l⃠l⃠e⃠r⃠-⃠x⃠m⃠d⃠",
      "ᗷᒪᗩᑕK-ᛕIᒪᒪEᖇ-᙭ᗰᗪ",
      "乃ㄥ卂匚Ҝ-Ҝ丨ㄥㄥ乇尺-乂爪ᗪ",
      "ʙʟᴀᴄᴋ-ᴋɪʟʟᴇʀ- xᴍᴅ",
      "【﻿ＢＬＡＣＫ－ＫＩＬＬＥＲ－ＸＭＤ】",
      "『b』『l』『a』『c』『k』『-』『k』『i』『l』『l』『e』『r』『-』『x』『m』『d』",
      "|b||l||a||c||k|-|k||i||l||l||e||r|-|x||m||d|",
      "๖ۣۜB๖ۣۜL๖ۣۜA๖ۣۜC๖ۣۜK-๖ۣۜK๖ۣۜI๖ۣۜL๖ۣۜL๖ۣۜE๖ۣۜR-๖ۣۜX๖ۣۜM๖ۣۜD",
      "b⃣l⃣a⃣c⃣k⃣-⃣k⃣i⃣l⃣l⃣e⃣r⃣-⃣x⃣m⃣d⃣",
      "b̶l̶a̶c̶k̶-̶k̶i̶l̶l̶e̶r̶-̶x̶m̶d̶",
      "b̷l̷a̷c̷k̷-̷k̷i̷l̷l̷e̷r̷-̷x̷m̷d̷",
      "b̲l̲a̲c̲k̲-̲k̲i̲l̲l̲e̲r̲-̲x̲m̲d̲",
      "b̾l̾a̾c̾k̾-̾k̾i̾l̾l̾e̾r̾-̾x̾m̾d̾"
    ];
    
    const styleIndex = parseInt(styleId) - 1;
    if (styleIndex < 0 || styleIndex >= styles.length) {
      return "❌ Invalid style number!\nUse .fancy to see available styles.";
    }
    
    // Replace placeholder with actual text
    return styles[styleIndex].replace(/𝖇𝖑𝖆𝖈𝖐-𝖐𝖎𝖑𝖑𝖊𝖗-𝖝𝖒𝖉|𝕓𝕝𝕒𝕔𝕜-𝕜𝕚𝕝𝕝𝕖𝕣-𝕩𝕞𝕕|𝐛𝐥𝐚𝐜𝐤-𝐤𝐢𝐥𝐥𝐞𝐫-𝐱𝐦𝐝|BLACK-KILLER-XMD|black-killer-xmd/gi, text);
  },
  
  // Individual style functions
  style1: (text) => `𝖇𝖑𝖆𝖈𝖐-𝖐𝖎𝖑𝖑𝖊𝖗-𝖝𝖒𝖉`.replace(/𝖇𝖑𝖆𝖈𝖐-𝖐𝖎𝖑𝖑𝖊𝖗-𝖝𝖒𝖉/gi, text),
  style2: (text) => `𝕓𝕝𝕒𝕔𝕜-𝕜𝕚𝕝𝕝𝕖𝕣-𝕩𝕞𝕕`.replace(/𝕓𝕝𝕒𝕔𝕜-𝕜𝕚𝕝𝕝𝕖𝕣-𝕩𝕞𝕕/gi, text),
  style3: (text) => `𝐛𝐥𝐚𝐜𝐤-𝐤𝐢𝐥𝐥𝐞𝐫-𝐱𝐦𝐝`.replace(/𝐛𝐥𝐚𝐜𝐤-𝐤𝐢𝐥𝐥𝐞𝐫-𝐱𝐦𝐝/gi, text),
  style4: (text) => `𝒷𝓁𝒶𝒸𝓀-𝓀𝒾𝓁𝓁𝑒𝓇-𝓍𝓂𝒹`.replace(/𝒷𝓁𝒶𝒸𝓀-𝓀𝒾𝓁𝓁𝑒𝓇-𝓍𝓂𝒹/gi, text),
  style5: (text) => `𝔟𝔩𝔞𝔠𝔨-𝔨𝔦𝔩𝔩𝔢𝔯-𝔵𝔪𝔡`.replace(/𝔟𝔩𝔞𝔠𝔨-𝔨𝔦𝔩𝔩𝔢𝔯-𝔵𝔪𝔡/gi, text),
  style6: (text) => `𝙗𝙡𝙖𝙘𝙠-𝙠𝙞𝙡𝙡𝙚𝙧-𝙭𝙢𝙙`.replace(/𝙗𝙡𝙖𝙘𝙠-𝙠𝙞𝙡𝙡𝙚𝙧-𝙭𝙢𝙙/gi, text),
  style7: (text) => `𝗯𝗹𝗮𝗰𝗸-𝗸𝗶𝗹𝗹𝗲𝗿-𝘅𝗺𝗱`.replace(/𝗯𝗹𝗮𝗰𝗸-𝗸𝗶𝗹𝗹𝗲𝗿-𝘅𝗺𝗱/gi, text),
  style8: (text) => `𝘣𝘭𝘢𝘤𝘬-𝘬𝘪𝘭𝘭𝘦𝘳-𝘹𝘮𝘥`.replace(/𝘣𝘭𝘢𝘤𝘬-𝘬𝘪𝘭𝘭𝘦𝘳-𝘹𝘮𝘥/gi, text),
  style9: (text) => `𝚋𝚕𝚊𝚌𝚔-𝚔𝚒𝚕𝚕𝚎𝚛-𝚡𝚖𝚍`.replace(/𝚋𝚕𝚊𝚌𝚔-𝚔𝚒𝚕𝚕𝚎𝚛-𝚡𝚖𝚍/gi, text),
  style10: (text) => `🅑🅛🅐🅒🅚-🅚🅘🅛🅛🅔🅡-🅧🅜🅓`.replace(/🅑🅛🅐🅒🅚-🅚🅘🅛🅛🅔🅡-🅧🅜🅓/gi, text)
};

zokou({
  nomCom: "fancy",
  alias: ["style", "font", "text"],
  categorie: "Fun",
  reaction: "🎨"
}, async (dest, zk, commandeOptions) => {

  const { arg, repondre, prefixe } = commandeOptions;
  
  try {
    // If no arguments, show help
    if (!arg || arg.length === 0) {
      const helpMessage = fancyStyles.list("BLACK-KILLER-XMD");
      return await repondre(helpMessage);
    }
    
    // Parse arguments
    const styleNumber = arg[0];
    const text = arg.slice(1).join(" ");
    
    // Validate inputs
    if (!styleNumber || !text || text.trim().length === 0) {
      const exampleText = `🎨 *FANCY TEXT GENERATOR*\n\n` +
                         `*Usage:* ${prefixe}fancy [number] [text]\n\n` +
                         `*Example:*\n` +
                         `${prefixe}fancy 1 BLACK-KILLER-XMD\n` +
                         `${prefixe}fancy 5 Hello World\n\n` +
                         `*Tip:* Use ${prefixe}fancy to see all styles`;
      return await repondre(exampleText);
    }
    
    // Check if style number is valid
    const styleNum = parseInt(styleNumber);
    if (isNaN(styleNum) || styleNum < 1 || styleNum > 30) {
      return await repondre(`❌ *Invalid style number!*\n\nPlease choose a number between 1 and 30.\nUse ${prefixe}fancy to see all available styles.`);
    }
    
    // Apply the selected style
    const fancyText = fancyStyles.apply(styleNum, text);
    
    // Create formatted response
    const responseMessage = `🎨 *FANCY TEXT GENERATED*\n\n` +
                           `*Style #${styleNum}:*\n` +
                           `\`\`\`${fancyText}\`\`\`\n\n` +
                           `*Original:* ${text}\n` +
                           `*Length:* ${fancyText.length} characters\n\n` +
                           `💡 *Tip:* Copy and use it anywhere!`;
    
    return await repondre(responseMessage);
    
  } catch (error) {
    console.error("FANCY ERROR:", error);
    
    const errorMessage = `❌ *Error generating fancy text!*\n\n` +
                        `*Possible reasons:*\n` +
                        `• Invalid characters in text\n` +
                        `• Style number out of range\n` +
                        `• Server error\n\n` +
                        `*Try:* ${prefixe}fancy 1 Hello`;
    
    return await repondre(errorMessage);
  }
});

// ADDITIONAL COMMAND: RANDOM FANCY TEXT
zokou({
  nomCom: "fancyr",
  alias: ["randomfont", "randomstyle"],
  categorie: "Fun",
  reaction: "🎲"
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre, prefixe } = commandeOptions;
  
  try {
    const text = arg.join(" ") || "BLACK-KILLER-XMD";
    const randomStyle = Math.floor(Math.random() * 30) + 1;
    const fancyText = fancyStyles.apply(randomStyle, text);
    
    const response = `🎲 *RANDOM FANCY TEXT*\n\n` +
                    `*Style #${randomStyle}:*\n` +
                    `\`\`\`${fancyText}\`\`\`\n\n` +
                    `*Original:* ${text}\n` +
                    `*Try others:* ${prefixe}fancy ${randomStyle} ${text}`;
    
    await repondre(response);
    
  } catch (error) {
    await repondre("❌ Error generating random fancy text!");
  }
});

// ADDITIONAL COMMAND: PREVIEW ALL STYLES FOR A TEXT
zokou({
  nomCom: "fancyall",
  alias: ["allfonts", "preview"],
  categorie: "Fun",
  reaction: "📋"
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre } = commandeOptions;
  
  const text = arg.join(" ") || "BLACK-KILLER-XMD";
  
  try {
    let previewMessage = `📋 *FANCY TEXT PREVIEW*\n\n` +
                         `*Text:* ${text}\n\n` +
                         `*Top 10 Styles:*\n`;
    
    // Show first 10 styles
    for (let i = 1; i <= 10; i++) {
      previewMessage += `${i}. ${fancyStyles.apply(i, text)}\n`;
    }
    
    previewMessage += `\n💡 *Use:* .fancy [1-30] ${text}`;
    
    await repondre(previewMessage);
    
  } catch (error) {
    await repondre("❌ Error generating preview!");
  }
});
