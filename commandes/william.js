const { default: makeWASocket } = require('@whiskeysockets/baileys');
const axios = require('axios');

const OPENAI_API_KEY = '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';
const OWNER_NUMBER = '255681613368@s.whatsapp.net'; // 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥S' number

const copilotReply = async (question) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 Copilot 🇹🇿. Answer clearly, professionally, and in English.' },
        { role: 'user', content: question }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI error:', error.message);
    return 'Sorry, there was an issue reaching 𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 Copilot. Please try again later.';
  }
};

const startBot = async () => {
  const sock = makeWASocket();

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const sender = msg.key.remoteJid;

    if (text.startsWith('.william ')) {
      const question = text.replace('.william ', '').trim();

      // Optional: restrict usage to owner only
      // if (sender !== OWNER_NUMBER) return;

      const answer = await copilotReply(question);
      await sock.sendMessage(sender, {
        text: `🤖 *𝗕𝗟𝗔𝗖𝗞 𝗞𝗜𝗟𝗟𝗘𝗥 Copilot 🇹🇿 says:*\n\n${answer}`
      });
    }
  });
};

startBot();
