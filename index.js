const { default: makeWASocket, useMultiFileAuthState } = require("@adiwajshing/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async (m) => {
    console.log('Mensagem recebida:', m);
  });
}

startBot();

