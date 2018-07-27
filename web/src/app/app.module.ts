import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GameListComponent } from './game/game-list/game-list.component';

import { AuthModule } from './auth/auth.module';
import { RouteModule } from './route/route.module';
import { HttpClientModule } from '@angular/common/http';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameListComponent
  ],
  imports: [
    AuthModule,
    UserModule,
    RouteModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
