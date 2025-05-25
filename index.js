const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@adiwajshing/baileys");
const qrcode = require('qrcode-terminal');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if(qr) {
      // Mostrar QR Code no terminal
      qrcode.generate(qr, { small: true });
      console.log('Escaneie este QR code com seu WhatsApp');
    }
    if(connection === 'close') {
      const reason = (lastDisconnect.error)?.output?.statusCode;
      if(reason === DisconnectReason.loggedOut) {
        console.log('Desconectado. Faça login novamente.');
      } else {
        console.log('Conexão fechada, tentando reconectar...');
        startBot();
      }
    }
    if(connection === 'open') {
      console.log('Bot conectado ao WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    console.log('Mensagem recebida:', m);
  });
}

startBot();
