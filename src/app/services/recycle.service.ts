import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { GlobalConstants } from '../common/global-constants';
import { DbRecord, VirtualService } from '../models/vs.model';
import { DataSource } from '@angular/cdk/table';
import { catchError, finalize } from 'rxjs/operators';
import { CollectionViewer } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root',
})
////////////////////////////////////////////////////////////////////////////////
/* RecycleService */
////////////////////////////////////////////////////////////////////////////////
export class RecycleService {
  constructor(private http: HttpClient) {}
  private uri = `${GlobalConstants.apiURL}/api/v1/recycle`;
  //////////////////////////////////////////////////////////////////////////////
  public get({
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
      .set('source', 'virtualserver')
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
  public delete(dbRecord: DbRecord): Observable<HttpResponse<string>> {
    const header = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });

    const endPoint = this.uri.concat('/', dbRecord.id);
    return this.http.delete<string>(endPoint, {
      headers: header,
      observe: 'response',
      reportProgress: true,
    });
  }
}
////////////////////////////////////////////////////////////////////////////////
/* RecycleServiceDs - datasource for RecycleService */
////////////////////////////////////////////////////////////////////////////////
export class RecycleServiceDs implements DataSource<DbRecord> {
  //////////////////////////////////////////////////////////////////////////////
  constructor(private service: RecycleService) {}
  //////////////////////////////////////////////////////////////////////////////
  public loading$ = new BehaviorSubject<boolean>(false);
  public records$ = new BehaviorSubject<DbRecord[]>([]);
  public response$ = new BehaviorSubject<VirtualService>(null);
  public sql = 0;
  //////////////////////////////////////////////////////////////////////////////
  public load(
    orderCol: string,
    orderDirection: string,
    filter: string,
    offset: number,
    limit: number
  ) {
    ////////////////////////////////////////////////////////////////////////////
    this.loading$.next(true);
    ////////////////////////////////////////////////////////////////////////////
    this.service
      .get({ orderCol, orderDirection, filter, offset, limit })
      .pipe(
        catchError((err) => {
          console.log(err.error)
          return err
        }),
        finalize(() => this.loading$.next(false))
      )
      .subscribe((r:HttpResponse<VirtualService>) => this.response$.next(r.body));
    ////////////////////////////////////////////////////////////////////////////
  }
  //////////////////////////////////////////////////////////////////////////////
  public connect(collectionViewer: CollectionViewer): Observable<DbRecord[]> {
    this.response$.subscribe((r) => {
      this.set(r);
    });
    return this.records$.asObservable();
  }
  //////////////////////////////////////////////////////////////////////////////
  public disconnect(collectionViewer: CollectionViewer): void {
    this.records$.complete();
    this.response$.complete();
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
}
