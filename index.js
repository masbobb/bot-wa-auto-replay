const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pino = require("pino");

// MASUKKAN API KEY GEMINI KAMU DI SINI
const genAI = new GoogleGenerativeAI(AIzaSyAJqEVG6sxbwHKgF27OLiU44OUE7rim-rY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            
            if (!text) return;
            console.log("Pesan masuk: " + text);

            try {
                // Minta jawaban dari Gemini
                const result = await model.generateContent(text);
                const response = await result.response;
                const aiReply = response.text();

                // Kirim jawaban AI ke WhatsApp
                await sock.sendMessage(from, { text: aiReply });
            } catch (error) {
                console.error("Error Gemini:", error);
            }
        }
    });

    console.log("Bot Gemini WA aktif...");
}

startBot();
// Tambahkan ini di bagian paling bawah file index.js agar Koyeb tidak error
const http = require('http');
const port = process.env.PORT || 8000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running\n');
}).listen(port);
