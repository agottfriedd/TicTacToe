import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { LobbyComponent } from './lobby/lobby.component';
import { HistoryComponent } from './history/history.component';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { GameComponent } from './game/game.component';
import { InformationComponent } from './information/information.component';

const config: SocketIoConfig = {url: environment.wsUrl, options: {
  transports: ['websocket']
}};

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    RegisterComponent,
    LobbyComponent,
    HistoryComponent,
    GameComponent,
    InformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
