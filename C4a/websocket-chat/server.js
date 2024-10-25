const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all connected clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Listen for WebSocket connections
wss.on('connection', (ws) => {
  console.log('A new client connected.');

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the chat!');

  // Listen for messages from the client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message); // Parse the incoming JSON

      // Format the message as "username: message"
      const formattedMessage = `${data.username}: ${data.message}`;
      
      console.log(`Received: ${formattedMessage}`);

      // Broadcast the formatted message to all clients
      wss.broadcast(formattedMessage);
    } catch (e) {
      console.error('Error parsing message', e);
    }
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
