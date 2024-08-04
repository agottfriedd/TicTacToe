import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from '../api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  games: any[] = [];

  constructor(
    private apiService: ApiServicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getGamesHistory();
  }

  getGamesHistory() {
    this.apiService.getGames().subscribe(
      (data) => {
        console.log('Historial de juegos recibido:', data);
        this.games = data;
      },
      (error) => {
        console.error('Error obteniendo historial de juegos:', error);
        if (error.status === 401) {
          console.log('Token inválido o expirado, redirigiendo al login');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  lobby(){
    this.router.navigate(['/lobby']);
  }
}