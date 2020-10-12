import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { CreateVsDialogService } from '../../services/create-vs-dialog.service';
import { DbRecord, Filter } from '../../models/vs.model';
import { EditVsDialogService } from '../../services/edit-vs-dialog.service';
import { ExportVS } from '../../models/export.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { VsService, VsServiceDs } from 'src/app/services/vs.service';
import { DeleteVsDialogService } from 'src/app/services/delete-vs-dialog.service';
import { FilterSheetService } from 'src/app/services/filter-sheet.service';
import { MigrateDialogService } from 'src/app/services/migrate-dialog.service';
import { RecycleDialogService } from 'src/app/services/recycle-dialog.service';
import { MigrateService } from 'src/app/services/migrate.service';
@Component({
  selector: 'app-vs-table',
  templateUrl: './vs-table.component.html',
  styleUrls: ['./vs-table.component.css', '../../global.css'],
})
export class VsTableComponent implements OnInit, AfterViewInit {
  constructor(
    private createVsDialogService: CreateVsDialogService,
    private deleteVsDialogService: DeleteVsDialogService,
    private dialog: EditVsDialogService,
    private filterSheet: FilterSheetService,
    private migrateDialog: MigrateDialogService,
    private recycleDialogService: RecycleDialogService,
    private user: UserService,
    public token: TokenService,
    public vsService: VsService,
  ) {}
  readonly separatorKeysCodes: number[] = [TAB, COMMA, ENTER];
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
      Key: 'Port',
      Value: 'ports',
      Notes: 'Wildcards required on both sides of the value',
    },
    {
      Key: 'Name',
      Value: 'name',
    },
    {
      Key: 'Service',
      Value: 'service_type',
    },
    {
      Key: 'IP',
      Value: 'ip',
    },
    {
      Key: 'DNS',
      Value: 'dns',
      Notes: 'Wildcards required on both sides of the value',
    },
  ];
  search: string[] = [];
  removable = true;
  addOnBlur = false;
  selectable = true;
  dataSource: VsServiceDs;
  displayedColumns = [
    'product_code',
    'platform',
    'load_balancer_ip',
    'ip',
    'port',
    'name',
    'service_type',
    'enabled',
    'status',
    '_last_30',
    'edit',
  ];
  lbType: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  openRestore(): void {
    this.recycleDialogService.openDialog();
  }
  submit() {
    this.loadRecords();
  }
  ngOnInit() {
    this.token.get();
    this.dataSource = new VsServiceDs(this.vsService);
    this.dataSource.get({offset:0,limit:10});
  }
  ngAfterViewInit() {
    merge(this.sort.sortChange, this.paginator.page, this.vsService.recordResponse$)
      .pipe(tap(() => this.loadRecords()))
      .subscribe();
  }
  loadRecords() {
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
  add() {
    this.createVsDialogService.openDialog();
  }
  edit(dbRecord: DbRecord) {
    this.dialog.openDialog(dbRecord);
  }
  migrate(dbRecord: DbRecord) {
    this.migrateDialog.openDialog(dbRecord);
  }
  isAdmin():boolean {
    if (this.token.admin) {
      return true;
    }
  }
  convertToCSV(dbRecord: DbRecord[], headerList) {
    const objArray: ExportVS[] = [];
    dbRecord.forEach((r) => {
      const ports: string[] = [];
      r.data.ports.forEach((p) => ports.push(p.port.toString()));
      const d: ExportVS = {
        name: r.data.name,
        port: ports.toString(),
        product_code: r.data.product_code,
        service: r.data.service_type,
        enabled: r.data.enabled,
        ip: r.data.ip,
        load_balancer_ip: r.load_balancer_ip,
        _last_30: r.data._last_30,
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
  downloadFile(data, filename = 'data') {
    const csvData = this.convertToCSV(data, [
      'name',
      'port',
      'product_code',
      'service',
      'enabled',
      'ip',
      'load_balancer_ip',
      '_last_30'
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
  viewUser() {
    this.user.openDialog();
  }
  getLoadBalancerName(list: string[]): string {
    for (const l of list) {
      if (l.startsWith('nsr.') || l.startsWith('lbc.')) {
        return l;
      }
    }
    return;
  }
  delete(dbRecord: DbRecord): void {
    this.deleteVsDialogService.openDialog(dbRecord);
  }
  openFilterList(): void {
    this.filterSheet.open(this.filter);
  }
  filterByProductCode(): void {
    for (const [key, value] of this.token.productCodes) {
      const search = 'product_code=' + value;
      this.paginator.firstPage();
      this.search.push(search);
    }
    this.submit();
  }
  filterByMfr(s: string): void {
    const search = 'platform=' + s;
    this.search.push(search);
    this.paginator.firstPage();
    this.submit();
  }
  filterByEnabled(b: boolean): void {
    const search = 'enabled=' + b;
    this.search.push(search);
    this.paginator.firstPage();
    this.submit();
  }
  clear(): void {
    this.search = [];
    this.submit();
  }
  goToMetrics(s: string, n: string): void {
    let url: string;
    if (s === 'netscaler') {
      url = `https://grafana.tmaws.io/d/vjxluRVGk/gns-netscaler-services?orgId=1&refresh=1m&var-virtual_server=${n}`;
    }
    if (s === 'avi networks') {
      url = `https://grafana.tmaws.io/d/qbghlR4Mk/gns-avi-services?orgId=1&refresh=1m&var-name=${n}`;
    }
    window.open(url, '_blank');
    return;
  }
  isDisabled(s: string): boolean {
   if (s.match(/.*ing.*/i)) {
     return true;
   }
    return false;
  }
}
