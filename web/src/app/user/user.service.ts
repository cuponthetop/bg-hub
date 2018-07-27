import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BACKEND } from '../conf';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  register(id_token: string): Observable<boolean> {

    return this.http.post<HttpResponse<string>>(
      BACKEND + "user/signin",
      { id_token },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .map((res: HttpResponse<string>): boolean => {
        return res !== null;
      });
  }
}