import Ws from 'App/Services/Ws'
Ws.boot()

const connectedPlayers: { [key: string]: string } = {};
const games: { [key: string]: { board: string[], currentPlayer: string } } = {};

Ws.io.on('connection', (socket) => {
  socket.on('player:join', (username) => {
    connectedPlayers[socket.id] = username;
    Ws.io.emit('players:update', Object.values(connectedPlayers));
  });

  socket.on('player:challenge', (data) => {
    const { challenger, challenged } = data;
    console.log(`${challenger} está retando a ${challenged}`);
    
    const challengedSocketId = Object.keys(connectedPlayers).find(key => connectedPlayers[key] === challenged);
    if (challengedSocketId) {
      socket.to(challengedSocketId).emit('challenge:received', { challenger });
    }
  });

  socket.on('challenge:response', (data) => {
    const { challenger, response } = data;
    const challengerSocketId = Object.keys(connectedPlayers).find(key => connectedPlayers[key] === challenger);
    if (challengerSocketId) {
      socket.to(challengerSocketId).emit('challenge:response', { challenger: connectedPlayers[socket.id], response });
    }
  });

  //gato
  //el socket de abajo es para para inciar el juego donde se asigna el jugador 1
  socket.on('game:start', (data) => {
    const { gameId, player1 } = data;
    games[gameId] = {
      board: Array(9).fill(''),
      currentPlayer: player1
    };
    socket.join(gameId);
  });

  //el socket de abajo es para determinar cual we va a jugar osea los movieminteos y demas
  socket.on('game:move', (data) => {
    const { gameId, position, symbol } = data;
    const game = games[gameId];

    //el if de abajo es para verificar si el juego existe y si la posicion esta vacia
    if (game && game.board[position] === '') {
      game.board[position] = symbol;
      game.currentPlayer = game.currentPlayer === data.player1 ? data.player2 : data.player1;

      //el emit de abajo es para enviar el movimiento a todos los jugadores
      Ws.io.to(gameId).emit('game:move', { position, symbol });

      //el if de abajo es para verificar si hay un ganador o si uhbo un empate
      const winner = checkWinner(game.board);
      if (winner || game.board.every(cell => cell !== '')) {
        Ws.io.to(gameId).emit('game:over', { winner });
        delete games[gameId];
      }
    }
  });

  socket.on('disconnect', () => {
    delete connectedPlayers[socket.id];
    Ws.io.emit('players:update', Object.values(connectedPlayers));
  });
});

function checkWinner(board: string[]): string | null {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
  
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
  
    return null;
}

//PRACTICA DE CHAR GRUPAL
// const chatMessages: {nickname: string, message: string}[] = [];

// Ws.io.on('connection', (socket) => {
//   socket.on('join:chat', (nickname) => {
//     socket.data.nickname = nickname;
//     socket.emit('chat:history', chatMessages);
//   });

//   socket.on('chat:message', (message) => {
//     const newMessage = {
//       nickname: socket.data.nickname,
//       message: message
//     };
//     chatMessages.push(newMessage);
//     Ws.io.emit('chat:new_message', newMessage);
//   });
// });


//PRACTICA SENCILLA DE COMUNICACION ENTRE ADONIS (POSTMAN) Y ANGUALR, LOS MSGS SE VEN EN LA CONSOLA
// Ws.io.on('connection', (socket) => {
  
//   //practica solo comunicacoin de postman con angular
//   socket.on('data:emit', async (data)=>{
//     console.log(data)  //Aqui muestro lo que me llega de los cleintes
//     socket.emit('data:listener', data)   //aqui regreso el mensaje propio del cliente
//     socket.broadcast.emit('data:listener', data) //aqui regreso el mensaje a todos los clientes
//   })
  
// })
