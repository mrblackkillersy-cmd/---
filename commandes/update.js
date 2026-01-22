const { zokou } = require('../framework/zokou');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

zokou({
    nomCom: "update",
    alias: ["upgrade", "gitpull", "refresh"],
    reaction: "🔄",
    categorie: "Owner",
    description: "Update bot from GitHub repository"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, superUser } = commandeOptions;
    
    // Owner only command
    if (!superUser) {
        return repondre("❌ Only bot owner can update!");
    }
    
    try {
        // Show updating message
        await repondre("🔄 *Checking for updates...*");
        
        // Check if git is available
        exec('git --version', async (error) => {
            if (error) {
                return repondre("❌ Git is not installed on the server!");
            }
            
            // Check current status
            exec('git status', async (error, stdout) => {
                if (error) {
                    return repondre("❌ Not a git repository or git error!");
                }
                
                // Check for updates
                await repondre("📡 *Fetching updates from GitHub...*");
                
                exec('git fetch origin', async (fetchError, fetchStdout) => {
                    if (fetchError) {
                        return repondre("❌ Failed to fetch updates!");
                    }
                    
                    // Check if there are updates
                    exec('git log HEAD..origin/main --oneline', async (logError, logStdout) => {
                        const hasUpdates = logStdout.trim().length > 0;
                        
                        if (!hasUpdates && arg[0] !== 'force') {
                            return repondre("✅ *Bot is already up to date!*\nUse `.update force` to force update.");
                        }
                        
                        if (hasUpdates) {
                            const updateCount = logStdout.split('\n').filter(l => l.trim()).length;
                            await repondre(`📦 *${updateCount} updates found!*\nStarting update process...`);
                        } else {
                            await repondre("⚡ *Force update initiated...*");
                        }
                        
                        // Perform the update
                        await performUpdate(zk, dest, repondre, arg);
                    });
                });
            });
        });
        
    } catch (error) {
        console.error("Update error:", error);
        repondre(`❌ Update error: ${error.message}`);
    }
});

// Perform the actual update
async function performUpdate(zk, dest, repondre, args) {
    try {
        // Step 1: Pull updates
        await repondre("⬇️ *Pulling updates...*");
        
        exec('git pull origin main', async (pullError, pullStdout) => {
            if (pullError) {
                return repondre(`❌ Pull failed:\n\`\`\`${pullError.message}\`\`\``);
            }
            
            const changes = pullStdout.trim();
            
            if (changes.includes('Already up to date') && !args.includes('force')) {
                return repondre("✅ *Already up to date!*");
            }
            
            await repondre("✅ *Updates pulled successfully!*\n\n" + 
                          "📋 *Changes:*\n```" + 
                          (changes.length > 500 ? changes.substring(0, 500) + "..." : changes) + 
                          "```");
            
            // Step 2: Install dependencies if package.json changed
            if (changes.includes('package.json') || args.includes('npm')) {
                await repondre("📦 *Installing/updating dependencies...*");
                
                exec('npm install', async (npmError, npmStdout) => {
                    if (npmError) {
                        await repondre(`⚠️ *NPM install had issues:*\n\`\`\`${npmError.message}\`\`\``);
                    } else {
                        await repondre("✅ *Dependencies updated!*");
                    }
                    
                    // Step 3: Restart bot
                    await restartBot(zk, dest, repondre);
                });
            } else {
                // Step 3: Restart bot without npm install
                await restartBot(zk, dest, repondre);
            }
        });
        
    } catch (error) {
        repondre(`❌ Update process error: ${error.message}`);
    }
}

// Restart the bot
async function restartBot(zk, dest, repondre) {
    try {
        await repondre("🔄 *Restarting bot...*\n\n" +
                      "⏳ *Please wait 10-15 seconds...*");
        
        // Send restart notification to owner
        const restartMsg = "🔄 *BOT RESTARTING*\n\n" +
                          "Update completed successfully!\n" +
                          "Bot is now restarting...\n\n" +
                          "⏳ *Please wait for restart*";
        
        await zk.sendMessage(dest, { text: restartMsg });
        
        // Restart using PM2 (if using PM2)
        if (process.env.PM2_HOME || fs.existsSync('/.pm2')) {
            exec('pm2 restart all', (error) => {
                if (error) {
                    // If PM2 fails, try alternative restart
                    setTimeout(() => {
                        process.exit(0);
                    }, 2000);
                }
            });
        } else {
            // Simple restart for non-PM2
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        }
        
    } catch (error) {
        repondre(`⚠️ *Restart notification sent, but auto-restart may need manual intervention.*\nError: ${error.message}`);
    }
}

// Update Status Command
zokou({
    nomCom: "updatestatus",
    alias: ["gitstatus", "version"],
    reaction: "📊",
    categorie: "Info",
    description: "Check bot version and update status"
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    try {
        // Get current commit info
        exec('git log --oneline -1', async (error, stdout) => {
            if (error) {
                return repondre("❌ Cannot get git info!");
            }
            
            const lastCommit = stdout.trim();
            
            // Get branch info
            exec('git branch --show-current', async (branchError, branchStdout) => {
                const branch = branchError ? 'unknown' : branchStdout.trim();
                
                // Check for updates
                exec('git fetch origin && git log HEAD..origin/main --oneline', async (updateError, updateStdout) => {
                    const hasUpdates = updateStdout.trim().length > 0;
                    const updateCount = hasUpdates ? updateStdout.split('\n').filter(l => l.trim()).length : 0;
                    
                    // Get package.json version
                    let version = "unknown";
                    try {
                        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
                        version = packageJson.version || "1.0.0";
                    } catch (e) {}
                    
                    const statusMsg = `📊 *BOT UPDATE STATUS*\n\n` +
                                     `🔧 *Version:* ${version}\n` +
                                     `🌿 *Branch:* ${branch}\n` +
                                     `📝 *Last Commit:* ${lastCommit}\n` +
                                     `🔄 *Updates Available:* ${hasUpdates ? `✅ (${updateCount} updates)` : '❌ None'}\n\n` +
                                     `*Commands:*\n` +
                                     `• .update - Pull updates\n` +
                                     `• .update force - Force update\n` +
                                     `• .update npm - Update with npm install\n` +
                                     `• .updatestatus - This status`;
                    
                    await repondre(statusMsg);
                });
            });
        });
        
    } catch (error) {
        repondre(`❌ Error: ${error.message}`);
    }
});
