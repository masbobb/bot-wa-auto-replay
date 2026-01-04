const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // QR akan muncul di log Render
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const from = msg.key.remoteJid;
            console.log("Ada pesan masuk dari: " + from);
            
            // Bot akan membalas otomatis apa pun pesannya
            await sock.sendMessage(from, { text: "Halo! Ini adalah bot otomatis Masbobb. Sedang aktif!" });
        }
    });

    console.log("Bot sedang menunggu pesan...");
}

startBot();
