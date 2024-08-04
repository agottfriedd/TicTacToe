import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiServicesService } from '../api-service.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  userInfo: any;
  connectedPlayers: string[] = [];

  constructor(
    private apiService: ApiServicesService,
    private router: Router,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.setupSocketListeners();
  }

  ngOnDestroy() {
    this.socket.removeAllListeners();
  }

  setupSocketListeners() {
    this.socket.on('players:update', (players: string[]) => {
      this.connectedPlayers = players.filter(player => player !== this.userInfo.username);
    });

    this.socket.on('challenge:received', (data: { challenger: string }) => {
      if (confirm(`${data.challenger} quiere jugar contigo. ¿Aceptas?`)) {
        this.socket.emit('challenge:response', { challenger: data.challenger, response: 'accept' });
        console.log('Reto aceptado');
        this.startGame(data.challenger, this.userInfo.username);
      } else {
        this.socket.emit('challenge:response', { challenger: data.challenger, response: 'reject' });
        console.log('Reto rechazado');
      }
    });

    this.socket.on('challenge:response', (data: { challenger: string, response: string }) => {
      if (data.response === 'accept') {
        console.log('Tu reto fue aceptado');
        this.startGame(this.userInfo.username, data.challenger);
      } else {
        console.log('Tu reto fue rechazado');
      }
    });
  }

  getUserInfo() {
    this.apiService.getUser().subscribe(
      (data) => {  
        console.log('Datos del usuario recibidos:', data);
        this.userInfo = data;
        this.apiService.setCurrentUser(this.userInfo.username);
        this.socket.emit('player:join', this.userInfo.username);
      },
      (error) => {
        console.error('Error obteniendo información del usuario:', error);
        if (error.status === 401) {
          console.log('Token inválido o expirado, redirigiendo al login');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  challengePlayer(player: string) {
    console.log(`Retando a ${player}`);
    this.socket.emit('player:challenge', { challenger: this.userInfo.username, challenged: player });
  }

  startGame(player1: string, player2: string) {
    this.apiService.startGame(player1, player2).subscribe(
      (response) => {
        console.log('Juego iniciado:', response);
        this.router.navigate(['/game', player1, player2]); 
      },
      (error) => {
        console.error('Error al iniciar el juego:', error);
      }
    );
  }

  goToInformation() {
    this.router.navigate(['/information']);
  }
  

  history(){
    this.router.navigate(['/history']);
  }

  logout() {
    this.apiService.logout().subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}