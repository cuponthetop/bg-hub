import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import {
  GoogleAuthService
} from 'ng-gapi';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BACKEND } from '../conf';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private googleUser: gapi.auth2.GoogleUser = null;

  constructor(private googleAuth: GoogleAuthService, private user: UserService) {
  }

  public signIn(): Observable<boolean> {
    return this.googleAuth.getAuth()
      .flatMap((auth): Promise<gapi.auth2.GoogleUser> => {
        return auth.signIn();
      })
      .flatMap((user: gapi.auth2.GoogleUser): Observable<boolean> => {
        this.googleUser = user;
        return this.user.register(user.getAuthResponse().id_token);
      });
  }

  public isSignedIn(): boolean {
    return null !== this.googleUser;
  }

  public signOut(): Observable<boolean> {
    if (null !== this.googleUser) {
      return this.googleAuth.getAuth()
        .flatMap((auth): Promise<gapi.auth2.GoogleUser> => {
          return auth.signOut();
        })
        .map((res): boolean => {
          return true;
        });
    } else {
      return Observable.of(true);
    }
  }

}
