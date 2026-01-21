require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');

const OWNER_NUMBER = '255681613368@s.whatsapp.net';

const copilotReply = async (question) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are BLACK KILLER Copilot 🇹🇿. Answer clearly, professionally, and in English.'
          },
          { role: 'user', content: question }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);
    return '⚠️ BLACK KILLER Copilot is temporarily unavailable.';
  }
};

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./session');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    if (!messages || !messages[0]) return;

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    const sender = msg.key.remoteJid;

    if (text.startsWith('.william ')) {
      const question = text.replace('.william ', '').trim();
      if (!question) return;

      // OPTIONAL OWNER LOCK
      // if (sender !== OWNER_NUMBER) return;

      const answer = await copilotReply(question);

      await sock.sendMessage(sender, {
        text:
`🤖 *BLACK KILLER Copilot 🇹🇿*

━━━━━━━━━━━━━━━━━━━━━━
${answer}
━━━━━━━━━━━━━━━━━━━━━━

⚡ BLACK KILLER • NEVER DIE`
      });
    }
  });
};

startBot();
