import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from '../api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  userInfo: any;

  constructor(
    private apiService: ApiServicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.apiService.getUser().subscribe(
      (data) => {  
        console.log('Datos del usuario recibidos:', data);
        this.userInfo = data;
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

  backToLobby() {
    this.router.navigate(['/lobby']);
  }
}