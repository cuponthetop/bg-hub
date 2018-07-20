import { Injectable } from '@angular/core';
import {
  GoogleAuthService
} from 'ng-gapi';

const SESSION_STORAGE_KEY: string = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: gapi.auth2.GoogleUser = null;

  constructor(private googleAuth: GoogleAuthService) {
  }

  public getToken(): string {
    let token: string = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error("no token set , authentication required");
    }
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  }

  public signIn(): void {
    this.googleAuth.getAuth()
      .subscribe((auth) => {
        auth.signIn().then(res => this.signInSuccessHandler(res));
      });
  }

  private signInSuccessHandler(res: gapi.auth2.GoogleUser) {
    this.user = res;
    sessionStorage.setItem(SESSION_STORAGE_KEY, res.getAuthResponse().access_token);
  }

  public isSignedIn(): boolean {
    return null === this.user;
  }

  public signOut(): void {
    if (null !== this.user) {
      this.googleAuth.getAuth().subscribe((auth) => {
        auth.signOut().then((res) => {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        });
      });
    }
  }
}
