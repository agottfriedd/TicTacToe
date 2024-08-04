import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LobbyComponent } from './lobby/lobby.component';
import { AuthGuard } from './auth.guard';
import { HistoryComponent } from './history/history.component';
import { GameComponent } from './game/game.component';
import { InformationComponent } from './information/information.component';

const routes: Routes = [
  {path: '', component: StartComponent, canActivate:[]},
  {path: 'login', component: LoginComponent, canActivate:[]},
  {path: 'register', component: RegisterComponent, canActivate:[]},
  {path: 'lobby', component: LobbyComponent, canActivate:[AuthGuard]},
  {path: 'information', component: InformationComponent, canActivate:[AuthGuard]},
  {path: 'history', component: HistoryComponent, canActivate: [AuthGuard]},
  { path: 'game/:player1/:player2', component: GameComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
