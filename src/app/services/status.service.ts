import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { DbRecord, VirtualService } from '../models/vs.model';
import { RootObject } from '../models/simple-vs.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { GlobalConstants } from '../common/global-constants';
import { catchError, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from '../models/response.model';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root',
})
////////////////////////////////////////////////////////////////////////////////
/* StatusService */
////////////////////////////////////////////////////////////////////////////////
export class StatusService implements OnDestroy  {
  //////////////////////////////////////////////////////////////////////////////
  constructor(private http: HttpClient) {}
  //////////////////////////////////////////////////////////////////////////////
  private uri = `${GlobalConstants.apiURL}/api/v1/status`;
  private simpleUri = `${GlobalConstants.apiURL}/api/v1/simple/status`;
  public recordResponse$ = new BehaviorSubject<DbRecord>(null);
  public loading$ = new BehaviorSubject<boolean>(false);
  public status$ = new BehaviorSubject<number>(0);
  //////////////////////////////////////////////////////////////////////////////
  create(dbRecord: DbRecord): Observable<HttpResponse<DbRecord>> {
    const HEADER = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    return this.http.post<DbRecord>(this.uri, dbRecord, {
      headers: HEADER,
      observe: 'response',
      reportProgress: true,
    });
  }
  //////////////////////////////////////////////////////////////////////////////
  delete(dbRecord: DbRecord): Observable<HttpResponse<DbRecord>> {
    const HEADER = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    const ENDPOINT = this.uri.concat('/', dbRecord.id);
    return this.http.delete<DbRecord>(ENDPOINT, {
      headers: HEADER,
      observe: 'response',
      reportProgress: true,
    });
  }
  //////////////////////////////////////////////////////////////////////////////
  ngOnDestroy() {
    try { this.recordResponse$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.loading$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.status$.unsubscribe(); } catch (error) { console.log(error) }
  }
  //////////////////////////////////////////////////////////////////////////////
  get({
    orderCol = '',
    orderDirection = '',
    filter = '',
    offset = 0,
    limit = 10,
  }: {
    orderCol?: string;
    orderDirection?: string;
    filter?: string;
    offset?: number;
    limit?: number;
  } = {}): Observable<HttpResponse<VirtualService>> {
    ////////////////////////////////////////////////////////////////////////////
    let p = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());
    if (orderCol !== '') {
      p = p.set('orderCol', orderCol.toString());
    }
    if (orderDirection !== '') {
      p = p.set('orderDirection', orderDirection.toString());
    }
    let f = '';
    if (filter !== '') {
      f = '?' + filter;
    }
    ////////////////////////////////////////////////////////////////////////////
    const header = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    return this.http.get<VirtualService>(this.uri + f, {
      headers: header,
      params: p,
      observe: 'response',
      reportProgress: true,
    });
    //////////////////////////////////////////////////////////////////////////////
  }
  //////////////////////////////////////////////////////////////////////////////
  modify(dbRecord: DbRecord): Observable<HttpResponse<DbRecord>> {
    const HEADER = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    return this.http.put<DbRecord>(this.uri, dbRecord, {
      headers: HEADER,
      observe: 'response',
      reportProgress: true,
    });
  }
  //////////////////////////////////////////////////////////////////////////////
  getSimple({
    orderCol = '',
    orderDirection = '',
    filter = '',
    offset = 0,
    limit = 10,
  }: {
    orderCol?: string;
    orderDirection?: string;
    filter?: string;
    offset?: number;
    limit?: number;
  } = {}): Observable<HttpResponse<RootObject>> {
    ////////////////////////////////////////////////////////////////////////////
    let p = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());
    if (orderCol !== '') {
      p = p.set('orderCol', orderCol.toString());
    }
    if (orderDirection !== '') {
      p = p.set('orderDirection', orderDirection.toString());
    }
    let f = '';
    if (filter !== '') {
      f = '?' + filter;
    }
    ////////////////////////////////////////////////////////////////////////////
    const header = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });
    return this.http.get<RootObject>(this.simpleUri + f, {
      headers: header,
      params: p,
      observe: 'response',
      reportProgress: true,
    });
    //////////////////////////////////////////////////////////////////////////////
  }
}
////////////////////////////////////////////////////////////////////////////////
/* StatusService */
////////////////////////////////////////////////////////////////////////////////
export class StatusServiceDs implements DataSource<DbRecord>, OnDestroy {
  //////////////////////////////////////////////////////////////////////////////
  constructor(private service: StatusService, private snackBar?: MatSnackBar) {}
  //////////////////////////////////////////////////////////////////////////////
  public loading$ = new BehaviorSubject<boolean>(false);
  public status$ = new BehaviorSubject<number>(0);
  public simpleResponse$ = new BehaviorSubject<RootObject>(null);
  public records$ = new BehaviorSubject<DbRecord[]>([]);
  public dsResponse$ = new BehaviorSubject<VirtualService>(null);
  public recordResponse$ = new BehaviorSubject<DbRecord>(null);
  public sql = 0;
  //////////////////////////////////////////////////////////////////////////////
  get(
    {
      orderCol = '',
      orderDirection = '',
      filter = '',
      offset = 0,
      limit = 10,
    }: {
      orderCol?: string;
      orderDirection?: string;
      filter?: string;
      offset?: number;
      limit?: number;
    } = {}
  ) {
    ////////////////////////////////////////////////////////////////////////////
    this.loading$.next(true);
    ////////////////////////////////////////////////////////////////////////////
    this.service
      .get({ orderCol, orderDirection, filter, offset, limit })
      .pipe(
        catchError((err) => {
          console.log(err.error);
          return err;
        }),
        finalize(() => this.finalize())
      )
      .subscribe((r: HttpResponse<VirtualService>) => {
        this.dsResponse$.next(r.body);
        this.status$.next(r.status);
      });
    ////////////////////////////////////////////////////////////////////////////
  }
  ////////////////////////////////////////////////////////////////////////////
  getSimple(
    {
      orderCol = '',
      orderDirection = '',
      filter = '',
      offset = 0,
      limit = 10,
    }: {
      orderCol?: string;
      orderDirection?: string;
      filter?: string;
      offset?: number;
      limit?: number;
    } = {}
  ) {
    ////////////////////////////////////////////////////////////////////////////
    this.loading$.next(true);
    ////////////////////////////////////////////////////////////////////////////
    this.service
      .getSimple({ orderCol, orderDirection, filter, offset, limit })
      .pipe(
        catchError((err) => {
          console.log(err.error);
          return err;
        }),
        finalize(() => this.finalize())
      )
      .subscribe((r: HttpResponse<RootObject>) => {
        this.simpleResponse$.next(r.body);
        this.status$.next(r.status);
        this.service.status$.next(r.status);
      });
    ////////////////////////////////////////////////////////////////////////////
  }
  //////////////////////////////////////////////////////////////////////////////
  create(dbRecord: DbRecord): void {
    ////////////////////////////////////////////////////////////////////////////
    this.loading$.next(true);
    this.service.loading$.next(true);
    ////////////////////////////////////////////////////////////////////////////
    this.service
      .create(dbRecord)
      .pipe(
        catchError((err) => {
          const exception = err.error as DbRecord;
          if (exception.last_error !== null) {
            this.snackBar.open('Error: ' + exception.last_error, 'Close', {
              duration: 10000,
            });
            return of(exception.last_error as string);
          } else {
            const simpleException = err.error as Response;
            this.snackBar.open('Error: ' + simpleException.message, 'Close', {
              duration: 10000,
            });
            return of(simpleException.message as string);
          }
        }),
        finalize(() => this.finalize())
      )
      .subscribe((r: HttpResponse<DbRecord>) => {
        this.recordResponse$.next(r.body);
        this.service.recordResponse$.next(r.body);
        this.status$.next(r.status);
        this.service.status$.next(r.status);
        if (r.status === 200) {
          this.snackBar.open(
            'Create request received: ' + dbRecord.data.name,
            'Close',
            {
              duration: 10000,
            }
          );
        }
      });
  }
  //////////////////////////////////////////////////////////////////////////////
  delete(dbRecord: DbRecord): void {
    ////////////////////////////////////////////////////////////////////////////
    this.loading$.next(true);
    this.service.loading$.next(true);
    ////////////////////////////////////////////////////////////////////////////
    this.service
      .delete(dbRecord)
      .pipe(
        catchError((err) => {
          const exception = err.error as DbRecord;
          if (exception.last_error !== null) {
            this.snackBar.open('Error: ' + exception.last_error, 'Close', {
              duration: 10000,
            });
            return of(exception.last_error as string);
          } else {
            const simpleException = err.error as Response;
            this.snackBar.open('Error: ' + simpleException.message, 'Close', {
              duration: 10000,
            });
            return of(simpleException.message as string);
          }
        }),
        finalize(() => this.finalize())
      )
      .subscribe((r: HttpResponse<DbRecord>) => {
        this.recordResponse$.next(r.body);
        this.service.recordResponse$.next(r.body);
        this.status$.next(r.status);
        this.service.status$.next(r.status);
        if (r.status === 200) {
          this.snackBar.open(
            'Delete status request received: ' + dbRecord.data.name,
            'Close',
            {
              duration: 10000,
            }
          );
        }
      });
  }
  //////////////////////////////////////////////////////////////////////////////
  modify(dbRecord: DbRecord): void {
    ////////////////////////////////////////////////////////////////////////////
    this.loading$.next(true);
    this.service.loading$.next(true);
    ////////////////////////////////////////////////////////////////////////////
    this.service
      .modify(dbRecord)
      .pipe(
        catchError((err) => {
          const exception = err.error as DbRecord;
          if (exception.last_error !== null) {
            this.snackBar.open('Error: ' + exception.last_error, 'Close', {
              duration: 10000,
            });
            return of(exception.last_error as string);
          } else {
            const simpleException = err.error as Response;
            this.snackBar.open('Error: ' + simpleException.message, 'Close', {
              duration: 10000,
            });
            return of(simpleException.message as string);
          }
        }),
        finalize(() => this.finalize())
      )
      .subscribe((r: HttpResponse<DbRecord>) => {
        this.recordResponse$.next(r.body);
        this.service.recordResponse$.next(r.body);
        this.status$.next(r.status);
        this.service.status$.next(r.status);
        if (r.status === 200) {
          this.snackBar.open(
            'Modify request received: ' + dbRecord.data.name,
            'Close',
            {
              duration: 10000,
            }
          );
        }
      });
  }
  //////////////////////////////////////////////////////////////////////////////
  finalize(): void {
    this.loading$.next(false);
  }
  //////////////////////////////////////////////////////////////////////////////
  public connect(collectionViewer: CollectionViewer): Observable<DbRecord[]> {
    this.dsResponse$.subscribe((r) => {
      this.set(r);
    });
    return this.records$.asObservable();
  }
  //////////////////////////////////////////////////////////////////////////////
  public disconnectOperations(): void {
    this.status$.complete();
    this.recordResponse$.complete();
    this.loading$.complete();
  }
  //////////////////////////////////////////////////////////////////////////////
  public disconnect(collectionViewer: CollectionViewer): void {
    this.records$.complete();
    this.status$.complete();
    this.dsResponse$.complete();
    this.loading$.complete();
  }
  //////////////////////////////////////////////////////////////////////////////
  public set(r: VirtualService) {
    if (r != null && r != undefined) {
      this.records$.next(r.db_records);
      if (r.sql_message !== undefined) {
        this.sql = r.sql_message._total;
      }
    }
  }
  ngOnDestroy() {
    try { this.recordResponse$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.loading$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.status$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.dsResponse$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.simpleResponse$.unsubscribe(); } catch (error) { console.log(error) }
  }
}
