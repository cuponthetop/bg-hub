import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {
  GoogleAuthService
} from 'ng-gapi';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BACKEND } from '../conf';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private googleUser: BehaviorSubject<gapi.auth2.GoogleUser> = new BehaviorSubject<gapi.auth2.GoogleUser>(null);
  private id_token: string = '';
  private sub: Subscription = null;

  constructor(private googleAuth: GoogleAuthService, private user: UserService) {
    this.sub = this.googleUser.map((user: gapi.auth2.GoogleUser) => {
      if (null !== user) {
        this.id_token = user.getAuthResponse().id_token;
      } else {
        this.id_token = '';
      }
      this.user.setUserToken(this.id_token);
      return this.id_token;
    })
      .filter((authID: string) => authID !== '')
      .flatMap((authID: string): Observable<User> => {
        return this.user.getUserInfoWithIDToken(authID);
      })
      .subscribe((user: User): void => {
        this.user.setCurrentUser(user);
      });
  }

  private loadAuth(): Observable<gapi.auth2.GoogleAuth> {
    return this.googleAuth.getAuth();
  }

  public signIn(): Observable<boolean> {
    return this.loadAuth()
      .flatMap((auth): Promise<gapi.auth2.GoogleUser> => {
        return auth.signIn();
      })
      .flatMap((user: gapi.auth2.GoogleUser): Observable<boolean> => {
        this.googleUser.next(user);
        let tokenID: string = user.getAuthResponse().id_token;
        return this.user.register(tokenID);
      });
  }

  public isSignedIn(): Observable<boolean> {
    return this.loadAuth()
      .map((auth: gapi.auth2.GoogleAuth): boolean => {
        this.googleUser.next(auth.currentUser.get());
        return auth.isSignedIn.get();
      });
  }

  private getIdToken(): string {
    return this.id_token;
  }

  public signOut(): Observable<boolean> {
    if (null !== this.googleUser) {
      return this.googleAuth.getAuth()
        .flatMap((auth): Promise<gapi.auth2.GoogleUser> => {
          return auth.signOut();
        })
        .map((res): boolean => {
          this.googleUser.next(null);
          return true;
        });
    } else {
      return Observable.of(true);
    }
  }

}
