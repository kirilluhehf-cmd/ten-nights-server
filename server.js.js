const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }
});

let gameState = {
  player1: { flashlight: false, direction: 0, tablet: false, camera: 1 },
  player2: { flashlight: false, direction: 0, tablet: false, camera: 2 },
  curtains_closed: false,
  maniac_charge: 0,
  rabat_stage: 0
};

io.on('connection', (socket) => {
  const role = io.engine.clientsCount === 1 ? 'player1' : 'player2';
  console.log(`Игрок подключился (${role})! ID:`, socket.id);

  socket.emit('assignedRole', role);
  socket.emit('updateState', gameState);

  socket.on('playerAction', (data) => {
    if (role === 'player1') {
      gameState.player1 = { ...gameState.player1, ...data };
    } else {
      gameState.player2 = { ...gameState.player2, ...data };
    }
    io.emit('updateState', gameState);
  });

  socket.on('toggleCurtains', (status) => {
    gameState.curtains_closed = status;
    io.emit('updateState', gameState);
  });
});

// Облачные хостинги автоматически передают порт через process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Облачный сервер запущен на порту ${PORT}`);
});