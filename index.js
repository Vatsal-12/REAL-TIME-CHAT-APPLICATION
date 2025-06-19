// server/index.js
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    for (let client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
