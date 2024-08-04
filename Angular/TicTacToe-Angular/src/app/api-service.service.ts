import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private baseUrl = environment.wsUrl;
  //private baseUrl = '192.168.255.101:3333';
  private currentUser: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getHeaders(needsAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    if (needsAuth) {
      const token = this.cookieService.get('token');
      console.log('Token in headers:', token);
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.error('No token found in cookie');
      }
    }
  
    return headers;
  }
  
  //REGISTER
  postUsers(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/users`, data, {headers: this.getHeaders()});
  }
  //LOGIN
  postLogin(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`, data, {headers: this.getHeaders()});
  }
  //LOBBY
  getUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`, {
      headers: this.getHeaders(true)
    })
  }
  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, {
      headers: this.getHeaders(true)
    }).pipe(
      tap(() => {
        this.cookieService.delete('token');
      }),
      catchError(this.handleError)
    );
  }
  //HISTORY
  getGames(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/games`, { headers: this.getHeaders(true) });
  }

  //GAME
  startGame(player1: string, player2: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/game`, { player1, player2 }, {
      headers: this.getHeaders(true)
    })
  }
  //tictactoe
  postGame(gameData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/games`, gameData, {
      headers: this.getHeaders(true)
    });
  }
  setCurrentUser(username: string) { //esto lo pongo saber cual es el usuario actual
    this.currentUser = username;
  }
  getCurrentUser(): string {  //agarro al cual es el usuario actual
    return this.currentUser;
  }
  updateUserStats(username: string, result: 'win' | 'loss' | 'draw'): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${username}/stats`, { result }, {
      headers: this.getHeaders(true)
    }).pipe(
      catchError(error => {
        console.error('Error al actualizar estadísticas:', error);
        return throwError(() => error);
      })
    );
  }

  //ERROR
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

}
