import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BACKEND } from '../conf';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { URLSearchParams } from 'url';

@Injectable()
export class UserService {
  private currentUser: User = null;
  private header: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  register(id_token: string): Observable<boolean> {
    return this.http.post<{ id: string }>(
      BACKEND + "user/signin",
      { token: id_token },
      { headers: this.header, observe: "response" }
    )
      .map((res: HttpResponse<{ id: string }>): boolean => {
        return res.status === 200;
      });
  }

  setUserToken(id_token: string) {
    this.header.set('TOKEN', id_token);
  }

  getUserInfo(userID: string): Observable<User> {
    return this.http.get<User>(
      `${BACKEND}user/${userID}`,
      { headers: this.header, observe: "response" }
    )
      .map((res: HttpResponse<User>): User => {
        return res.body;
      });
  }

  getUserInfoWithIDToken(id_token: string): Observable<User> {
    return this.http.get<{ id: string }>(
      `${BACKEND}user?authID=${id_token}`,
      {
        headers: this.header,
      }
    )
      .map((res: { id: string }): string => {
        return res.id;
      })
      .flatMap((userID: string) => this.getUserInfo(userID));
  }
}