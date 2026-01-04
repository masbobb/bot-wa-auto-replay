from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Ini adalah data rahasia yang nanti kita isi di Render, bukan di kode langsung (lebih aman)
TOKEN = os.environ.get("WA_TOKEN")
PHONE_ID = os.environ.get("PHONE_ID")
VERIFY_TOKEN = os.environ.get("VERIFY_TOKEN")

@app.route("/", methods=["GET"])
def home():
    return "Bot WA Aktif!"

@app.route("/webhook", methods=["GET", "POST"])
def webhook():
    # Proses Verifikasi Webhook dari Facebook
    if request.method == "GET":
        mode = request.args.get("hub.mode")
        token = request.args.get("hub.verify_token")
        challenge = request.args.get("hub.challenge")
        
        if mode == "subscribe" and token == VERIFY_TOKEN:
            return challenge, 200
        return "Forbidden", 403

    # Proses Pesan Masuk
    data = request.json
    try:
        if "messages" in data['entry'][0]['changes'][0]['value']:
            message = data['entry'][0]['changes'][0]['value']['messages'][0]
            contact = data['entry'][0]['changes'][0]['value']['contacts'][0]
            
            sender_phone = message['from']
            sender_name = contact['profile']['name']
            
            # Logika Balas Pesan
            reply_text = f"Halo {sender_name}! Terima kasih sudah menghubungi kami. Pesan kamu sudah kami terima."
            
            send_whatsapp_message(sender_phone, reply_text)
    except Exception as e:
        print(f"Error: {e}")
    
    return jsonify({"status": "success"}), 200

def send_whatsapp_message(to, text):
    url = f"https://graph.facebook.com/v18.0/{PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }
    requests.post(url, json=payload, headers=headers)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
