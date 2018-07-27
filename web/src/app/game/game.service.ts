import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BACKEND } from '../conf';
import { Observable } from 'rxjs';

@Injectable()
export class GameService {
  constructor(private http: HttpClient) { }

}