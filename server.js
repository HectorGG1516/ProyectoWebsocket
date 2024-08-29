const WebSocket = require('ws');
const db = require('./database');
const { generateToken, verifyToken } = require('./auth');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
    const token = req.url.split('?token=')[1];

    if (!verifyToken(token)) {
        ws.close();
        return;
    }

    console.log('Cliente conectado');

    ws.send('Bienvenido al servidor WebSocket');

    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);

        db.run("INSERT INTO messages(content) VALUES (?)", [message]);

        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket está escuchando en ws://localhost:8080');
