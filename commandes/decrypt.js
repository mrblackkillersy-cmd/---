const { zokou } = require('../framework/zokou');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

zokou({
    nomCom: "decrypt",
    alias: ["decode", "unpack"],
    reaction: "🔓",
    categorie: "Owner",
    utilisation: "{prefix}decrypt [code/link/file]"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, superUser, msgRepondu } = commandeOptions;
    
    // Owner only
    if (!superUser) {
        return repondre("❌ Owner command only!");
    }
    
    if (!arg[0] && !msgRepondu) {
        const help = `🔓 *JAVASCRIPT DECRYPTER*\n\n` +
                    `*Usage:*\n` +
                    `• Reply to code: .decrypt\n` +
                    `• From file: .decrypt file index.js\n` +
                    `• Auto detect: .decrypt auto\n` +
                    `• Test: .decrypt test\n\n` +
                    `*Powered by de4js engine*`;
        return repondre(help);
    }
    
    try {
        let codeToDecrypt = "";
        
        // Get code from different sources
        if (msgRepondu) {
            // From replied message
            if (msgRepondu.conversation) codeToDecrypt = msgRepondu.conversation;
            else if (msgRepondu.extendedTextMessage?.text) codeToDecrypt = msgRepondu.extendedTextMessage.text;
        } else if (arg[0] === 'file' && arg[1]) {
            // From file
            const filepath = path.join(__dirname, '..', arg[1]);
            if (fs.existsSync(filepath)) {
                codeToDecrypt = fs.readFileSync(filepath, 'utf8');
            } else {
                return repondre(`❌ File not found: ${arg[1]}`);
            }
        } else {
            // From arguments
            codeToDecrypt = arg.join(' ');
        }
        
        if (!codeToDecrypt || codeToDecrypt.length < 10) {
            return repondre("❌ No valid code to decrypt!");
        }
        
        await repondre("🔍 Processing... This may take a moment");
        
        // DECRYPTION LOGIC
        let decrypted = await decryptJavaScript(codeToDecrypt);
        
        if (!decrypted || decrypted.length < 10) {
            return repondre("❌ Decryption failed!");
        }
        
        // Format and send result
        const result = `✅ *DECRYPTION SUCCESSFUL*\n\n` +
                      `*Original:* ${codeToDecrypt.length} chars\n` +
                      `*Decrypted:* ${decrypted.length} chars\n\n` +
                      `*Preview:*\n\`\`\`javascript\n${decrypted.substring(0, 1500)}\n\`\`\``;
        
        await repondre(result);
        
        // Save full file if large
        if (decrypted.length > 1500) {
            const filename = `decrypted_${Date.now()}.js`;
            fs.writeFileSync(filename, decrypted);
            
            await zk.sendMessage(dest, {
                document: fs.readFileSync(filename),
                mimetype: 'application/javascript',
                fileName: filename
            });
            
            fs.unlinkSync(filename);
            await repondre("📁 Full file sent as document!");
        }
        
    } catch (error) {
        console.error("Decrypt error:", error);
        repondre(`❌ Error: ${error.message}`);
    }
});

// MAIN DECRYPTION FUNCTION
async function decryptJavaScript(code) {
    let result = code;
    
    // METHOD 1: Remove eval wrapper
    if (code.includes('eval(') && code.includes(')')) {
        try {
            // Extract code inside eval
            const evalMatch = code.match(/eval\(([\s\S]*?)\)$/);
            if (evalMatch) {
                const insideEval = evalMatch[1];
                
                // If it's a string, remove quotes
                if (insideEval.startsWith('"') && insideEval.endsWith('"')) {
                    result = insideEval.slice(1, -1);
                } else if (insideEval.startsWith("'") && insideEval.endsWith("'")) {
                    result = insideEval.slice(1, -1);
                } else {
                    result = insideEval;
                }
                
                // Decode percentage encoding (Leonard Tech style)
                result = result.replace(/%([0-9A-F]{2})/gi, (match, hex) => {
                    return String.fromCharCode(parseInt(hex, 16));
                });
            }
        } catch (e) {}
    }
    
    // METHOD 2: Try XOR decryption with common keys
    const commonKeys = ['kizD', 'Lp3v', 'Dhqw', 'secret', 'key', 'password', '1234'];
    
    for (const key of commonKeys) {
        try {
            const xorDecrypted = xorDecrypt(result, key);
            
            // Check if it looks like valid JS
            if (isValidJavaScript(xorDecrypted)) {
                result = `// Decrypted with XOR key: "${key}"\n${xorDecrypted}`;
                break;
            }
        } catch (e) {}
    }
    
    // METHOD 3: Try Base64 decoding
    try {
        const base64Decoded = Buffer.from(result, 'base64').toString('utf8');
        if (isValidJavaScript(base64Decoded)) {
            result = base64Decoded;
        }
    } catch (e) {}
    
    // METHOD 4: Try to run in sandbox (careful!)
    if (result.includes('function') && result.includes('return')) {
        try {
            const sandbox = { console: { log: () => {} } };
            vm.createContext(sandbox);
            const script = new vm.Script(`(() => { ${result} })()`);
            const executed = script.runInContext(sandbox);
            if (executed && typeof executed === 'string') {
                result = executed;
            }
        } catch (e) {}
    }
    
    // Clean up the result
    result = cleanJavaScript(result);
    
    return result;
}

// XOR Decryption
function xorDecrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

// Check if text looks like JavaScript
function isValidJavaScript(text) {
    if (!text || text.length < 10) return false;
    
    const jsIndicators = ['function', 'const', 'var', 'let', 'return', 'require', 'module.exports'];
    let score = 0;
    
    jsIndicators.forEach(indicator => {
        if (text.includes(indicator)) score += 10;
    });
    
    if (text.includes('{') && text.includes('}')) score += 5;
    if (text.includes('(') && text.includes(')')) score += 5;
    if (!text.includes('�')) score += 5; // No encoding errors
    
    return score > 15;
}

// Clean JavaScript code
function cleanJavaScript(code) {
    let cleaned = code;
    
    // Remove multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Add newlines after semicolons
    cleaned = cleaned.replace(/;/g, ';\n');
    
    // Add newlines after braces
    cleaned = cleaned.replace(/{/g, '{\n');
    cleaned = cleaned.replace(/}/g, '\n}');
    
    // Fix common issues
    cleaned = cleaned.replace(/\\x([0-9A-F]{2})/gi, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
    
    return cleaned;
                   }
