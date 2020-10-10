import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { RootObject, Request } from '../models/migrate.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class MigrateService {
  public loading$ = new BehaviorSubject<boolean>(false);
  public response$ = new BehaviorSubject<RootObject>(null);
  public status$ = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) { }

  public set(id: string, productCode: number): Observable<HttpResponse<RootObject>> {
    const uri = `${GlobalConstants.apiURL}/api/v1/migrate/virtualserver/${id}`;

    const header = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });

    const req: Request = {product_code: productCode};
    return this.http.post<RootObject>(uri,
      req,
      {
      headers: header,
      observe: 'response',
      reportProgress: true,
    });
  }

  public get(id: string): Observable<HttpResponse<RootObject>>{
    const uri = `${GlobalConstants.apiURL}/api/v1/migrate/virtualserver/${id}`;

    const header = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });

    return this.http.get<RootObject>(uri,
      {
      headers: header,
      observe: 'response',
      reportProgress: true,
    });
  }

  public migrate(id: string): Observable<HttpResponse<RootObject>>{
    const uri = `${GlobalConstants.apiURL}/api/v1/migrate/virtualserver/${id}`;

    const header = new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
    });

    return this.http.put<RootObject>(uri,null,
      {
      headers: header,
      observe: 'response',
      reportProgress: true,
    });
  }
  public disconnect(): void {
    this.loading$.complete();
    this.response$.complete();
    this.status$.complete();
  }
}

