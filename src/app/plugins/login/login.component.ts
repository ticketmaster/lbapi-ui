import { Component, OnInit } from '@angular/core';
import { Login, Result } from '../../models/login.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private service: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  path: string;
  token: Result;
  err = null;
  public loading$ = new BehaviorSubject<boolean>(false);

  model: Login = {
    username: '',
    password: '',
  };

  ngOnInit(): void {
    localStorage.clear();
  }

  onSubmit(f: NgForm) {
    this.login(f.value);
  }

  login(m: Login): Promise<Result> {
    const u = m.username;
    const p = m.password;
    this.loading$.next(true);
    const promise = new Promise<Result>((resolve, reject) => {
      this.service
        .get(u, p)
        .toPromise()
        .then(
          (res) => {
            // Success
            this.loading$.next(false);
            sessionStorage.setItem('jwt', res.Token);
            this.router.navigate(['/vs']);
            this.err = '';
            resolve();
          },
          (msg) => {
            // Error
            this.loading$.next(false);
            this.err = 'Invalid Credentials';
            this.snackBar.open(this.err, 'Close', {
              duration: 5000,
            });
            reject(msg);
          }
        );
    });
    return promise;
  }
}
