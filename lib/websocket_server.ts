//@ts-check
import { WebSocketServer } from 'ws';
import { Server } from 'http';

const subscribers = new Map();

export function initializeWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(data);

        if (data.type === 'subscribe' && data.userId) {
          subscribers.set(data.userId.toString(), ws);
          console.log(`User ${data.userId} subscribed`);
          ws.send(
            JSON.stringify({ status: 'subscribed', userId: data.userId })
          );
        }
      } catch (error) {
        console.error('Invalid message format:', error);
        ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });

    ws.on('close', () => {
      for (const [userId, socket] of subscribers.entries()) {
        if (socket === ws) {
          subscribers.delete(userId);
          console.log(`User ${userId} unsubscribed`);
          break;
        }
      }
    });
  });

  console.log('WebSocket server initialized');
}

export function walletUpdateSocket(userId, body) {
  console.log('Sending transaction update first...');
  const wsClient = subscribers.get(userId.toString());

  if (wsClient && wsClient.readyState === wsClient.OPEN) {
    console.log('Sending transaction update...');
    wsClient.send(
      JSON.stringify({
        type: 'transaction_update',
        message: 'Transfer successful',
        amount: body.amount,
        recipient: body.recipient,
      })
    );
  }
}
