import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    private snackBar: MatSnackBar
  ) {}
  public token: User;
  public productCodes: Map<number, number>;



  public clear() {
    sessionStorage.removeItem('jwt');
  }

  public get() {
    let prd: number[] = [];
    this.productCodes = new Map();
    this.token = JSON.parse(
      JSON.stringify(jwt_decode(sessionStorage.getItem('jwt')))
    ) as User;

    const DATE = new Date();
    const TIMESTAMP = DATE.getTime();
    let timeout = (this.token.exp*1000)-TIMESTAMP

    if (timeout < 0) {
      this.snackBar.open(
        'Token has expired',
        'Close',
        {
          duration: 10000,
        }
      );
      this.clear();
    }

    this.token.roles.forEach((r) => {
      const result = r.match(/PRD[0-9]*/);
      if (result !== null) {
        const code = result[0].replace('PRD', '');
        if (code !== '') {
          prd.push(parseInt(code));
        }
      }
    });
    prd = prd.sort(function (a, b) {
      return a - b;
    });
    for (const p of prd) {
      this.productCodes.set(p, p);
    }
  }
  
  public testMembership(code: number): boolean {
    if (this.productCodes.get(code) === code) {
      return true;
    } else {
      return false;
    }
  }
}
