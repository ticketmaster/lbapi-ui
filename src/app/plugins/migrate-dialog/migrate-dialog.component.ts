import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { RootObject, MigrateData } from '../../models/migrate.model';
import { TokenService } from 'src/app/services/token.service';
import { MigrateService } from 'src/app/services/migrate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DbRecord } from '../..//models/vs.model';
@Component({
  selector: 'app-migrate-dialog',
  templateUrl: './migrate-dialog.component.html',
  styleUrls: ['./migrate-dialog.component.css', '../../global.css'],
})
export class MigrateDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MigrateDialogComponent>,
    private token: TokenService,
    public migrateService: MigrateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public source: DbRecord
  ) {}
  productCodes: number[] = [];
  productCode: number = 0;
  response: RootObject = null;
  ready: boolean;
  ngOnInit(): void {
    this.setToken();
    this.load();
  }
  private setToken(): void {
    this.token.get();
    this.token.productCodes.forEach((v) => {
      if (v !== 1813) {
        this.productCodes.push(v);
      }
    });
  }
  private reload(): void {
    if (
      (this.response === null || this.response.data === undefined) &&
      this.productCode !== 0 &&
      this.productCode !== 1813
    ) {
      //////////////////////////////////////////////////////////////////////////
      // Set record - if required.
      //////////////////////////////////////////////////////////////////////////
      this.migrateService
        .set(this.source.id, this.productCode)
        .pipe(finalize(() => this.finalizeFetch()))
        .subscribe((r) => {
          this.response = r.body;
          this.ready = true;
          this.migrateService.response$.next(r.body);
          this.migrateService.status$.next(r.status);
        });
    } else {
      this.migrateService.loading$.next(false);
      this.ready = true;
    }
  }
  pInt(v: string): number {
    return Number(v);
  }
  isAdmin(): boolean {
    if (this.token.admin) {
      return true;
    }
  }
  private load(): void {
    //////////////////////////////////////////////////////////////////////////
    this.migrateService.loading$.next(true);
    this.productCode = this.source.data.product_code;
    this.response = null;
    //////////////////////////////////////////////////////////////////////////
    // Fetch existing record - if exists.
    //////////////////////////////////////////////////////////////////////////
    this.migrateService
      .get(this.source.id)
      .subscribe((r: HttpResponse<RootObject>) => {
        if (r.body.data === undefined || r.body.data == null) {
          console.log('reload');
          this.reload();
          return;
        }
        this.migrateService.loading$.next(false);
        this.response = r.body;
        this.productCode = this.response.data.product_code;
        this.migrateService.response$.next(r.body);
        this.migrateService.status$.next(r.status);
        this.ready = true;
      });
    return;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
  public onSubmit(f: NgForm): void {
    this.response = null;
    if (f.valid === false) {
      this.snackBar.open('Error: Required fields are still blank', 'Close', {
        duration: 10000,
      });
    } else {
      this.migrateService.loading$.next(true);
      this.migrateService
        .set(this.source.id, this.productCode)
        .pipe(finalize(() => this.finalizeFetch()))
        .subscribe((r) => {
          this.response = r.body;
          this.migrateService.response$.next(r.body);
          this.migrateService.status$.next(r.status);
        });
    }
  }
  public migrate(id: string): void {
    this.migrateService.loading$.next(true);
    this.migrateService
      .migrate(this.source.id)
      .pipe(
        finalize(() => {
          this.finalizeFetch();
          this.close();
        })
      )
      .subscribe((r) => {
        this.response = r.body;
        this.migrateService.response$.next(r.body);
        this.migrateService.status$.next(r.status);
      });
  }
  public finalizeFetch() {
    this.migrateService.loading$.next(false);
  }
  public close() {
    this.dialogRef.close();
  }
}
