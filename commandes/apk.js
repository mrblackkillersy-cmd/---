const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "apk",
    alias: ["app", "playstore", "mod"],
    categorie: "Download",
    reaction: "📱"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
    
    if (!arg[0]) {
      return repondre(
        "📱 *APK DOWNLOADER*\n\n" +
        "*Usage:* .apk [app name]\n" +
        "*Examples:*\n" +
        "• .apk whatsapp\n" +
        "• .apk facebook lite\n" +
        "• .apk instagram mod\n\n" +
        "*Note:* This downloads from APKPure"
      );
    }

    const appName = arg.join(" ").trim();
    
    try {
      await repondre(`🔍 *Searching for:* ${appName}...`);
      
      // Use APKPure API instead of broken BK9 API
      const searchUrl = `https://apkpure.com/search?q=${encodeURIComponent(appName)}`;
      
      // Get search results
      const searchResponse = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      // Extract download links from HTML (simplified)
      // Note: APKPure has anti-scraping, so we need alternative
      
      // ALTERNATIVE 1: Use different API
      return await alternativeAPKDownload(appName, dest, zk, ms, repondre);
      
    } catch (error) {
      console.error("APK Error:", error.message);
      
      // Try alternative methods
      return await tryAlternativeMethods(appName, dest, zk, ms, repondre);
    }
  }
);

// Alternative APK Download Function
async function alternativeAPKDownload(appName, dest, zk, ms, repondre) {
  try {
    // Try multiple APK sources
    
    // Source 1: APKCombo (More reliable)
    const apkComboUrl = `https://apkcombo.com/search?q=${encodeURIComponent(appName)}`;
    
    // Since most APK sites block scraping, use direct download from trusted sources
    const moddedApps = {
      'whatsapp': {
        name: 'WhatsApp Plus',
        url: 'https://www.apkmirror.com/apk/whatsapp-inc/whatsapp/',
        type: 'mod'
      },
      'youtube': {
        name: 'YouTube Vanced',
        url: 'https://vancedapp.com/',
        type: 'mod'
      },
      'instagram': {
        name: 'Instagram Plus',
        url: 'https://www.instagramplus.me/',
        type: 'mod'
      },
      'spotify': {
        name: 'Spotify Premium',
        url: 'https://spotifyapk.com/',
        type: 'mod'
      },
      'tiktok': {
        name: 'TikTok Mod',
        url: 'https://tiktokapk.org/',
        type: 'mod'
      }
    };
    
    const appLower = appName.toLowerCase();
    let foundApp = null;
    
    // Check if it's a known modded app
    for (const [key, app] of Object.entries(moddedApps)) {
      if (appLower.includes(key)) {
        foundApp = app;
        break;
      }
    }
    
    if (foundApp) {
      await repondre(`✅ *Found:* ${foundApp.name}\n\n*Note:* Most modded apps require manual download\nVisit: ${foundApp.url}`);
      
      // Try to get direct download if available
      if (foundApp.type === 'mod') {
        // For popular mods, use direct links
        const directLinks = {
          'whatsapp': 'https://www.mediafire.com/file/whatsapp-plus.apk/file',
          'youtube': 'https://github.com/YTVanced/VancedManager/releases',
          'spotify': 'https://spotifyapk.com/download/'
        };
        
        if (directLinks[appLower]) {
          await zk.sendMessage(dest, {
            text: `📱 *${foundApp.name}*\n\nDirect Download:\n${directLinks[appLower]}\n\n_For safety, always download from trusted sources_`
          }, { quoted: ms });
        }
      }
      return;
    }
    
    // Source 2: Use APKMirror API (more reliable)
    await repondre("🔄 Trying APKMirror...");
    
    // APKMirror doesn't have public API, so we use search
    const searchQuery = appName.replace(/\s+/g, '-').toLowerCase();
    const apkMirrorUrl = `https://www.apkmirror.com/?s=${searchQuery}`;
    
    // Send search link instead
    await zk.sendMessage(dest, {
      text: `🔍 *APK Search Results*\n\n*App:* ${appName}\n\n*Search on:*\n• APKMirror: ${apkMirrorUrl}\n• APKPure: https://apkpure.com/search?q=${encodeURIComponent(appName)}\n• APKCombo: https://apkcombo.com/search?q=${encodeURIComponent(appName)}\n\n*For modded apps:*\nVisit trusted sites like:\n- https://moddroid.com/\n- https://revdl.com/`
    }, { quoted: ms });
    
  } catch (error) {
    console.error("Alternative download error:", error);
    await repondre("❌ Could not fetch APK. Please try:\n1. Visit apkmirror.com\n2. Search manually\n3. Use trusted mod sites");
  }
}

// Try alternative methods
async function tryAlternativeMethods(appName, dest, zk, ms, repondre) {
  try {
    // Try different APIs
    
    // API 1: APK Downloader API
    const api1 = await axios.get(`https://api.apkdownloadcounter.com/search?q=${appName}`).catch(() => null);
    
    if (api1?.data?.results?.length > 0) {
      const app = api1.data.results[0];
      await zk.sendMessage(dest, {
        document: { url: app.download_url },
        fileName: `${app.name}.apk`,
        caption: `📱 ${app.name} v${app.version}`
      }, { quoted: ms });
      return;
    }
    
    // API 2: Alternative source
    const api2 = await axios.get(`https://apk.support/api/search?q=${appName}`).catch(() => null);
    
    if (api2?.data?.success) {
      const app = api2.data.data[0];
      await repondre(`📱 *${app.title}*\n\nVersion: ${app.version}\nSize: ${app.size}\n\nDownload: ${app.download_link}`);
      return;
    }
    
    // If all APIs fail, provide search links
    await repondre(
      `🔍 *APK Search for:* ${appName}\n\n` +
      `*Manual Search Links:*\n` +
      `• https://www.apkmirror.com/?s=${encodeURIComponent(appName)}\n` +
      `• https://apkpure.com/search?q=${encodeURIComponent(appName)}\n` +
      `• https://apkcombo.com/search?q=${encodeURIComponent(appName)}\n\n` +
      `*For Modded Apps:*\n` +
      `• https://moddroid.com/search?q=${encodeURIComponent(appName)}\n` +
      `• https://revdl.com/search/${encodeURIComponent(appName)}\n` +
      `• https://androeed.ru/search?search=${encodeURIComponent(appName)}`
    );
    
  } catch (error) {
    await repondre("❌ All download methods failed. Please search manually.");
  }
}

// MODDED APPS COMMAND (SPECIAL)
zokou({
  nomCom: "mod",
  alias: ["modded", "premium"],
  categorie: "Download",
  reaction: "⚡"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  if (!arg[0]) {
    const modList = `⚡ *MODDED APPS LIST*\n\n` +
                   `*Available mods:*\n` +
                   `• .mod whatsapp - WhatsApp Plus\n` +
                   `• .mod youtube - YouTube Vanced/ReVanced\n` +
                   `• .mod spotify - Spotify Premium\n` +
                   `• .mod instagram - Instagram Plus\n` +
                   `• .mod tiktok - TikTok Mod\n` +
                   `• .mod snaptube - SnapTube Premium\n` +
                   `• .mod kinemaster - KineMaster Premium\n` +
                   `• .mod photoshop - Photoshop Express\n\n` +
                   `*Trusted Mod Sites:*\n` +
                   `• ModDroid: https://moddroid.com\n` +
                   `• RevDL: https://revdl.com\n` +
                   `• Androeed: https://androeed.ru`;
    
    return repondre(modList);
  }
  
  const modName = arg[0].toLowerCase();
  const moddedApps = {
    'whatsapp': {
      name: 'WhatsApp Plus',
      description: 'Enhanced WhatsApp with extra features',
      download: 'https://whatsapp-plus.en.uptodown.com/android/download',
      features: ['Custom themes', 'Privacy options', 'Enhanced media sharing']
    },
    'youtube': {
      name: 'YouTube ReVanced',
      description: 'Ad-free YouTube with background play',
      download: 'https://github.com/revanced/revanced-manager/releases',
      features: ['No ads', 'Background play', 'Download videos', 'SponsorBlock']
    },
    'spotify': {
      name: 'Spotify Premium Mod',
      description: 'Unlocked Spotify premium features',
      download: 'https://spotifyapk.com/download/',
      features: ['No ads', 'Unlimited skips', 'Extreme quality', 'Download songs']
    },
    'instagram': {
      name: 'Instagram Plus',
      description: 'Enhanced Instagram experience',
      download: 'https://www.instagramplus.me/download/',
      features: ['Download media', 'Zoom profile pictures', 'Copy comments/bio']
    },
    'tiktok': {
      name: 'TikTok Mod',
      description: 'TikTok without restrictions',
      download: 'https://tiktokapk.org/download/',
      features: ['No watermark', 'Download videos', 'Region unlock']
    }
  };
  
  if (moddedApps[modName]) {
    const app = moddedApps[modName];
    
    const message = `⚡ *${app.name}*\n\n` +
                   `*Description:* ${app.description}\n\n` +
                   `*Features:*\n${app.features.map(f => `• ${f}`).join('\n')}\n\n` +
                   `*Download:* ${app.download}\n\n` +
                   `⚠️ *Warning:*\n` +
                   `• Download from trusted sources only\n` +
                   `• Some mods may require root\n` +
                   `• Use at your own risk`;
    
    await zk.sendMessage(dest, {
      text: message,
      detectLinks: true
    }, { quoted: ms });
    
  } else {
    await repondre(`❌ Mod for "${arg[0]}" not found.\nUse ".mod" to see available mods.`);
  }
});

// DIRECT APK DOWNLOAD COMMAND (For specific apps)
zokou({
  nomCom: "directapk",
  alias: ["getapk", "dlapk"],
  categorie: "Download",
  reaction: "📥"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;
  
  const directApps = {
    'whatsapp': 'https://www.apkmirror.com/apk/whatsapp-inc/whatsapp/whatsapp-2-24-7-76-release/whatsapp-messenger-2-24-7-76-android-apk-download/',
    'facebook': 'https://www.apkmirror.com/apk/facebook-2/facebook/facebook-431-0-0-45-116-release/facebook-431-0-0-45-116-android-apk-download/',
    'messenger': 'https://www.apkmirror.com/apk/facebook-2/messenger/messenger-435-0-0-14-116-release/messenger-435-0-0-14-116-android-apk-download/',
    'instagram': 'https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-319-0-0-34-123-release/instagram-319-0-0-34-123-android-apk-download/',
    'telegram': 'https://www.apkmirror.com/apk/telegram-fz-llc/telegram/telegram-10-5-0-release/telegram-messenger-10-5-0-android-apk-download/'
  };
  
  if (!arg[0]) {
    const list = `📥 *DIRECT APK DOWNLOADS*\n\n` +
                `*Available:* ${Object.keys(directApps).join(', ')}\n\n` +
                `*Usage:* .directapk [app name]\n` +
                `*Example:* .directapk whatsapp`;
    return repondre(list);
  }
  
  const appName = arg[0].toLowerCase();
  
  if (directApps[appName]) {
    await repondre(`📥 *${appName.toUpperCase()} APK*\n\nDownload link:\n${directApps[appName]}\n\n*Source:* APKMirror (Trusted)`);
  } else {
    await repondre(`❌ Direct download not available for "${appName}".\nTry: ${Object.keys(directApps).join(', ')}`);
  }
});
