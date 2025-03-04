import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.cookieService.get('token');
    console.log('AuthGuard: Token en cookies:', token);
    if (token) {
      return true;
    } else {
      console.log('AuthGuard: No hay token, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}