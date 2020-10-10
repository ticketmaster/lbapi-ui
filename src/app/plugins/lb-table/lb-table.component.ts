import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DbRecord, Filter } from '../../models/lb.model';
import { ExportLB } from '../../models/export.model';
import {
  LbService,
  LbServiceDs,
} from '../../services/lb.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { DeleteLbDialogService } from '../../services/delete-lb-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterSheetService } from 'src/app/services/filter-sheet.service';
////
@Component({
  selector: 'app-lb-table',
  templateUrl: './lb-table.component.html',
  styleUrls: ['./lb-table.component.css', '../../global.css'],
})
////
export class LbTableComponent implements OnInit, AfterViewInit {
  constructor(
    private service: LbService,
    private user: UserService,
    public token: TokenService,
    public dialog: MatDialog,
    private filterSheet: FilterSheetService,
    public deleteLbDialogService: DeleteLbDialogService,
  ) {}
  filter: Filter[] = [
    {
      Key: 'Product Code',
      Value: 'product_code',
    },
    {
      Key: 'Load Balancer',
      Value: 'load_balancer_ip',
    },
    {
      Key: 'Cluster',
      Value: 'cluster_dns',
      Notes: 'Wildcards required on both sides of the value',
    },
    {
      Key: 'Cluster IP',
      Value: 'cluster_ip',
    },
    {
      Key: 'Model',
      Value: 'model',
    },
    {
      Key: 'Firmware',
      Value: 'firmware',
    },
  ];
  readonly separatorKeysCodes: number[] = [ENTER, TAB, COMMA];
  search: string[] = [];
  removable = true;
  addOnBlur = true;
  selectable = true;
  dbrecord: DbRecord;
  dataSource: LbServiceDs;
  displayedColumns = [
    'load_balancer_ip',
    'cluster_dns',
    'cluster_ip',
    'model',
    'firmware',
    'edit',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public submit() {
    this.loadRecords();
  }
  public ngOnInit() {
    this.token.get();
    this.dataSource = new LbServiceDs(this.service);
    this.dataSource.get({offset:0,limit:10});
  }
  public ngAfterViewInit() {
    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.service.recordResponse$
    )
      .pipe(tap(() => this.loadRecords()))
      .subscribe();
  }
  public logout() {
    localStorage.clear();
  }
  public loadRecords() {
    let filter = '';
    let add = '';
    this.search.forEach((v, k) => {
      if (k !== 0) {
        add = '&';
      }
      filter += add + v;
    });
    const next = this.paginator.pageIndex * this.paginator.pageSize;
    this.dataSource.get(
      {
        orderCol:this.sort.active,
        orderDirection:this.sort.direction,
        filter: filter,
        offset: next,
        limit: this.paginator.pageSize
      }     
    );
  }
  public convertToCSV(dbRecord: DbRecord[], headerList) {
    const objArray: ExportLB[] = [];
    dbRecord.forEach((r) => {
      const clusterDns: string[] = [];
      r.data.cluster_dns.forEach((v) => clusterDns.push(v));
      const d: ExportLB = {
        product_code: r.data.product_code,
        cluster_dns: clusterDns.toString().replace(',', ' '),
        mfr: r.data.mfr,
        ip: r.load_balancer_ip,
        model: r.data.model,
      };
      objArray.push(d);
    });
    const array =
      typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }
  public downloadFile(data, filename = 'data') {
    const csvData = this.convertToCSV(data, [
      'product_code',
      'cluster_dns',
      'mfr',
      'ip',
      'model',
    ]);
    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser =
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  public removeSearchOption(option: string): void {
    const index = this.search.indexOf(option);
    if (index >= 0) {
      this.search.splice(index, 1);
    }
    this.submit();
  }
  public addSearchOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.replace(/("|')/g, '');
    const components: string[] = [];
    if ((value || '').trim()) {
      this.search.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.submit();
  }
  public viewUser() {
    this.user.openDialog();
  }
  public delete(dbRecord: DbRecord): void {
    this.deleteLbDialogService.openDialog(dbRecord);
  }
  public edit(dbRecord: DbRecord): void {}
  public openFilterList(): void {
    this.filterSheet.open(this.filter);
  }
  public clear(): void {
    this.search = [];
    this.submit();
  }
}
