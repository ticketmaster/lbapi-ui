import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  RecycleServiceDs,
  RecycleService,
} from 'src/app/services/recycle.service';
import { TokenService } from 'src/app/services/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DbRecord } from 'src/app/models/vs.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { TAB, COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-recycle-dialog',
  templateUrl: './recycle-dialog.component.html',
  styleUrls: ['./recycle-dialog.component.css', '../../global.css'],
})
export class RecycleDialogComponent implements OnInit, AfterViewInit {
  constructor(public token: TokenService, public service: RecycleService) {}
  //////////////////////////////////////////////////////////////////////////////
  readonly separatorKeysCodes: number[] = [TAB, COMMA, ENTER];
  //////////////////////////////////////////////////////////////////////////////
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //////////////////////////////////////////////////////////////////////////////
  public search: string[] = [];
  public removable = true;
  public addOnBlur = false;
  public selectable = true;
  public dataSource: RecycleServiceDs;
  public displayedColumns = [
    'product_code',
    'platform',
    'load_balancer_ip',
    'ip',
    'port',
    'name',
    'service_type',
  ];
  ngOnInit(): void {
    this.token.get();
    this.dataSource = new RecycleServiceDs(this.service);
    this.dataSource.load('', '', '', 0, 10);
  }
  ngAfterViewInit() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.reload()))
      .subscribe();
  }
  reload() {
    let filter = '';
    let add = '';
    this.search.forEach((v, k) => {
      if (k !== 0) {
        add = '&';
      }
      filter += add + v;
    });
    const next = this.paginator.pageIndex * this.paginator.pageSize;
    this.dataSource.load(
      this.sort.active,
      this.sort.direction,
      filter,
      next,
      this.paginator.pageSize
    );
  }
  delete(d: DbRecord): void {}
  removeSearchOption(option: string): void {
    const index = this.search.indexOf(option);
    if (index >= 0) {
      this.search.splice(index, 1);
    }
    this.paginator.firstPage();
    this.submit();
  }
  addSearchOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.replace(/("|')/g, '');
    if ((value || '').trim()) {
      this.search.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.paginator.firstPage();
    this.submit();
  }
  submit() {
    this.reload();
  }
  clear(): void {
    this.search = [];
    this.submit();
  }
  restore(d: DbRecord): void {}
}
