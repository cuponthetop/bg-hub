import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url: string = state.url;
    if (url === 'login') {
      return Observable.of(true);
    } else {
      return this.auth.isSignedIn().map((isSignedIn: boolean) => {
        if (false === isSignedIn) {
          this.router.navigate(['/login'], {
            queryParams: { return: state.url }
          })
          return false;
        } else {
          return true;
        }
      });

    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
