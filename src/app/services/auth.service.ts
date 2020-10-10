import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login, Result } from '../models/login.model';
import { Router } from '@angular/router';
import { GlobalConstants } from './../common/global-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  get(user: string, pass: string): Observable<Result> {
    const payload: Login = {
      username: user,
      password: pass,
    };

    const body: string = JSON.stringify(payload);
    const result = this.http.post(`${GlobalConstants.apiURL}/login`, body);
    return result.pipe(map((t: Result) => t));
  }
}
