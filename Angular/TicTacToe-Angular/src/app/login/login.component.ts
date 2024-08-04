import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiServicesService } from '../api-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  
  constructor(private router: Router, private formBuilder: FormBuilder, private apiServices: ApiServicesService, private cookieService: CookieService) {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  postLogin() {
    if (this.loginForm.valid) {
      this.apiServices.postLogin(this.loginForm.value).subscribe(
        response => {
          if (response && response.token) {
            this.cookieService.set('token', response.token, { path: '/' });
            console.log('Token guardado:', this.cookieService.get('token'));
            this.router.navigate(['/lobby']);
          } else {
            console.error('No se recibió un token válido');
          }
        },
        error => {
          console.error('Error de login:', error);
          alert (error.error.message);
        }
      );
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToLobby() {
    this.router.navigate(['/lobby']);
  }

}
