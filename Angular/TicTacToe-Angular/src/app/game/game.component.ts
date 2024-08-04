import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from '../api-service.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  player1: string = '';
  player2: string = '';
  currentPlayer: string = '';
  board: string[] = Array(9).fill('');
  gameOver: boolean = false;
  winner: string | null = null;
  gameId: string = '';
  mySymbol: string = '';
  showRedirectMessage: boolean = false;
  redirectCountdown: number = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiServicesService,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.player1 = params['player1'];
      this.player2 = params['player2'];
      this.currentPlayer = this.player1;
      this.gameId = `${this.player1}-${this.player2}`;
      this.mySymbol = this.apiService.getCurrentUser() === this.player1 ? 'X' : 'O';
      this.startGame();
    });

    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('game:move', (data: {position: number, symbol: string}) => {
      this.board[data.position] = data.symbol;
      this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    });

    this.socket.on('game:over', (data: {winner: string | null}) => {
      this.gameOver = true;
      this.winner = data.winner === 'X' ? this.player1 : (data.winner === 'O' ? this.player2 : null);
      if (this.apiService.getCurrentUser() === this.player1) {
        this.saveGameResult();
      }
      this.startRedirectCountdown();
    });
  }

  startGame() {
    this.socket.emit('game:start', { gameId: this.gameId, player1: this.player1, player2: this.player2 });
  }

  makeMove(position: number) {
    if (!this.board[position] && !this.gameOver && this.currentPlayer === this.apiService.getCurrentUser()) {
      this.socket.emit('game:move', { gameId: this.gameId, position, symbol: this.mySymbol });
    }
  }

  saveGameResult() {
    const gameData = {
      player_one: this.player1,
      player_two: this.player2,
      winner: this.winner || 'Empate'
    };
  
    this.apiService.postGame(gameData).subscribe(
      response => {
        console.log('Juego guardado:', response);
        this.updatePlayerStats(this.player1);
        this.updatePlayerStats(this.player2);
      },
      error => console.error('Error al guardar el juego:', error)
    );
  }
  
  updatePlayerStats(player: string) {
    const result = this.winner === player ? 'win' : (this.winner ? 'loss' : 'draw');
    console.log(`Actualizando estadísticas para ${player}:`, result);
    this.apiService.updateUserStats(player, result).subscribe(
      statsResponse => console.log(`Estadísticas actualizadas para ${player}:`, statsResponse),
      error => console.error(`Error al actualizar estadísticas para ${player}:`, error)
    );
  }

  startRedirectCountdown() {
    this.showRedirectMessage = true;
    const countdownInterval = setInterval(() => {
      this.redirectCountdown--;
      if (this.redirectCountdown <= 0) {
        clearInterval(countdownInterval);
        this.router.navigate(['/lobby']);
      }
    }, 1000);
  }
}