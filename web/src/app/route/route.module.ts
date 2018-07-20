import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthGuard } from '../auth/auth.guard';
import { GameListComponent } from '../game-list/game-list.component';

const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: GameListComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
})
export class RouteModule { }
