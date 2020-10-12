import {
  DbRecord,
  HealthMonitor,
  Binding,
  Port,
  Pool,
  Persistence,
  Certificate,
} from '../../models/vs.model';
import { VsDbRecord } from '../../models/simple-vs.model';
import { DbRecord as LbDbRecord, List } from '../../models/lb.model';
import { Component, Inject, OnInit,  OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TokenService } from 'src/app/services/token.service';
import { VsService, VsServiceDs } from 'src/app/services/vs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm, FormControl } from '@angular/forms';
import { LbService, LbServiceDs } from 'src/app/services/lb.service';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
//
@Component({
  selector: 'app-create-dialog',
  templateUrl: 'create-vs-dialog.component.html',
  styleUrls: ['create-vs-dialog.component.css', '../../global.css'],
})
//
export class CreateVsDialogComponent implements OnInit, OnDestroy {
  constructor(
    ////////////////////////////////////////////////////////////////////////////
    private _tokenService: TokenService,
    public _lbService: LbService,
    public _vsService: VsService,
    private _snackBar: MatSnackBar,
    ////////////////////////////////////////////////////////////////////////////
    public dialogRef: MatDialogRef<CreateVsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public source: DbRecord
  ) {
    this.filteredVs = this.sharedIPControl.valueChanges.pipe(
      startWith(''), 
      map((vs) => (vs ? this._filteredIps(vs) : []))
    );
  }
  //////////////////////////////////////////////////////////////////////////////
  public lbDbRecords: LbDbRecord[] = [];
  public vsDbRecords: VsDbRecord[] = [];
  public sharedIPControl = new FormControl();
  public filteredVs: Observable<VsDbRecord[]>;
  public mapVs = new Map<string, string>();
  public vsDataSource: VsServiceDs;
  public lbDataSource: LbServiceDs;
  public apiUri = GlobalConstants.apiURL;
  public jsonDbRecord = JSON.stringify(this.source);
  public dbRecord = JSON.parse(this.jsonDbRecord) as DbRecord;
  public entryComponents: [CreateVsDialogComponent];
  public isNetscaler: boolean;
  public listLb: List[] = [];
  public mapLb = new Map<string, List>();
  public panelOpenState = false;
  public productCodes: number[] = [];
  public vsEnabledText: string;
  public port: Port = {
    ssl_enabled: false,
  };
  public binding: Binding = {
    enabled: true,
    server: {},
  };
  public monitor: HealthMonitor = {
    receive_timeout: 15,
    response_codes: [],
    send_interval: 30,
    successful_count: 1,
    type: 'tcp',
  };
  public persistence: Persistence = {};
  public pool: Pool = {
    weight:1,
    bindings: [this.binding],
    enabled: true,
    health_monitors: [this.monitor],
    name: '(New)',
    persistence: this.persistence,
    ssl_enabled: false,
  };
  public certificate: Certificate = {
    key: {},
  };
  public alias: string;
  private _filteredIps(value: string): VsDbRecord[] {
    if (value === '') {return}
    const filterValue = value.toLowerCase();
    return this.vsDbRecords.filter((vs) => vs.ip.indexOf(filterValue) === 0);
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  //////////////////////////////////////////////////////////////////////////////
  setShared(s: string): void {
    if (s == null || s == undefined || s == '') {
      this.dbRecord.data.ip = '';
      this.dbRecord.load_balancer_ip = '';
      this.dbRecord.platform = null;
      return;
    }
    this.setLbList();
    this.dbRecord.data.ip = s;
    this.setLb(this.mapVs.get(s));
  }
  updateFields(event: MatSelectChange, p: number, h: number): void {
    const value: string = event.value;
    const request = document.getElementById(
      'request-' + p + '-' + h
    ) as HTMLElement;
    const response = document.getElementById(
      'response-' + p + '-' + h
    ) as HTMLElement;
    const responsecode = document.getElementById(
      'responsecode-' + p + '-' + h
    ) as HTMLElement;
    request.style.display = 'none';
    response.style.display = 'none';
    responsecode.style.display = 'none';
    if (
      value.includes('ecv') ||
      value.includes('http') ||
      value.includes('external')
    ) {
      request.style.display = 'flex';
      response.style.display = 'flex';
    }
    if (value.includes('http')) {
      responsecode.style.display = 'flex';
    }
  }
  updateCertificate(event: any, type: string) {
    const certificates: Certificate[] = [];
    if (this.dbRecord.data.certificates === undefined) {
      this.dbRecord.data.certificates = certificates;
    }
    if (this.dbRecord.data.certificates.length === 0) {
      this.dbRecord.data.certificates.push(this.certificate);
    }
    if (type === 'public') {
      this.dbRecord.data.certificates[0].certificate = event.target.value;
    }
    if (type === 'private') {
      this.dbRecord.data.certificates[0].key.private_key = event.target.value;
    }
    if (type === 'passphrase') {
      this.dbRecord.data.certificates[0].key.pass_phrase = event.target.value;
    }
  }
  addDnsRecord(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const components: string[] = [];
    if (this.dbRecord.data.dns === undefined) {
      this.dbRecord.data.dns = [];
    }
    if ((value || '').trim()) {
      this.dbRecord.data.dns.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }
  isAdmin():boolean {
    if (this._tokenService.admin) {
      return true;
    }
  }
  addResponseCode(event: MatChipInputEvent, p: number, h: number): void {
    const input = event.input;
    const value = event.value;
    const components: string[] = [];
    if (
      this.dbRecord.data.pools[p].health_monitors[h].response_codes ===
      undefined
    ) {
      this.dbRecord.data.pools[p].health_monitors[
        h
      ].response_codes = components;
    }
    if ((value || '').trim()) {
      this.dbRecord.data.pools[p].health_monitors[h].response_codes.push(
        value.trim()
      );
    }
    if (input) {
      input.value = '';
    }
  }
  setName(s: string) {
    const prd = `prd${this.dbRecord.data.product_code}`;
    let name: string;
    name = s.trim();
    name = name.replace(/(\-| |\s)/g, '.');
    this.alias = `${prd}-${name}`;
    this.dbRecord.data.name = name.toLowerCase();
  }
  addPool(): void {
    const jsonPool = JSON.stringify(this.pool);
    const pool = JSON.parse(jsonPool) as Pool;
    if (this.dbRecord.data.pools === undefined) {
      const pools: Pool[] = [pool];
      this.dbRecord.data.pools = pools;
      return;
    }
    this.dbRecord.data.pools.push(pool);
  }
  addPort(): void {
    const jsonPort = JSON.stringify(this.port);
    const port = JSON.parse(jsonPort) as Port;
    this.dbRecord.data.ports.push(port);
  }
  addBinding(p: number): void {
    const bindings: Binding[] = [];
    const jsonBinding = JSON.stringify(this.binding);
    const binding = JSON.parse(jsonBinding) as Binding;
    if (this.dbRecord.data.pools[p].bindings === undefined) {
      this.dbRecord.data.pools[p].bindings = bindings;
    }
    this.dbRecord.data.pools[p].bindings.push(binding);
  }
  addHealthMonitor(p: number): void {
    const jsonMonitor = JSON.stringify(this.monitor);
    const monitor = JSON.parse(jsonMonitor) as HealthMonitor;
    this.dbRecord.data.pools[p].health_monitors.push(monitor);
  }
  removePort(p: number): void {
    const index = p;
    if (index >= 0) {
      this.dbRecord.data.ports.splice(index, 1);
    }
  }
  removeBinding(p: number, b: number): void {
    const index = b;
    if (index >= 0) {
      this.dbRecord.data.pools[p].bindings.splice(index, 1);
    }
  }
  removeHealthMonitor(p: number, h: number): void {
    const index = h;
    if (index >= 0) {
      this.dbRecord.data.pools[p].health_monitors.splice(index, 1);
    }
  }
  removePool(p: number): void {
    const index = p;
    if (index >= 0) {
      this.dbRecord.data.pools.splice(index, 1);
    }
  }
  removeResponseCode(responseCode: string, p: number, h: number): void {
    const index = this.dbRecord.data.pools[p].health_monitors[
      h
    ].response_codes.indexOf(responseCode);
    if (index >= 0) {
      this.dbRecord.data.pools[p].health_monitors[h].response_codes.splice(
        index,
        1
      );
    }
  }
  removeDnsRecord(v: string): void {
    const index = this.dbRecord.data.dns.indexOf(v);
    if (index >= 0) {
      this.dbRecord.data.dns.splice(index, 1);
    }
  }
  testLength() {
    return true;
  }
  ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////
    this.getLoadBalancerList();
    this.getVsList();
    ////////////////////////////////////////////////////////////////////////////
    this._tokenService.get();
    this._tokenService.productCodes.forEach((v) => {
      if (v !== 1813) {
        this.productCodes.push(v);
      }
    });
    if (this.dbRecord.platform === 'netscaler') {
      this.isNetscaler = true;
    }
  }

  ngOnDestroy() {
    try { this.vsDataSource.simpleResponse$.unsubscribe(); } catch (error) { console.log(error) }
    try { this.lbDataSource.dsResponse$.unsubscribe(); } catch (error) { console.log(error) }
    }

  getLoadBalancerList(): void {
    this.lbDataSource = new LbServiceDs(this._lbService);
    this.lbDataSource.get({
      orderCol: 'cluster_ip',
      orderDirection: 'asc',
      limit: 99999,
    });

    this.lbDataSource.dsResponse$.subscribe((result) => {
      if (result != null) {
        this.lbDbRecords = result.db_records;
        this.setLbList();
      }
    });
  }
  filterVsList():string {
    let s: string[]=[];
    let filter = '';
    let add = '';
    for (const [key, value] of this._tokenService.productCodes) {
      const search = 'product_code=' + value;
      s.push(search);
    }
    s.forEach((v, k) => {
      if (k !== 0) {
        add = '&';
      }
      filter += add + v;
    });
    return filter
  }
  getVsList(): void {
    this.vsDataSource = new VsServiceDs(this._vsService, this._snackBar);
    this.vsDataSource.loading$.next(true);
    let filter: string;
    filter = this.filterVsList()

    this.vsDataSource.getSimple({
      filter: filter,
      orderCol: 'ip',
      orderDirection: 'asc',
      limit: 99999,
    });

    this.vsDataSource.simpleResponse$.subscribe((result) => {
      if (result != null) {
        this.vsDbRecords = result.vs_db_records;
        for (const i of this.vsDbRecords) {
          this.mapVs.set(i.ip, i.load_balancer_ip);
        }
      }
    });
  }
  setLb(s: string): void {
    if (s === '' || s === null || s === undefined) {
      return;
    }
    this.dbRecord.load_balancer_ip = s;
    this.dbRecord.platform = this.mapLb.get(s).mfr;
    if (this.dbRecord.platform === 'netscaler') {
      this.isNetscaler = true;
    } else {
      this.isNetscaler = false;
    }
  }
  setLbField() {
    if (
      this.dbRecord.platform === '' ||
      this.dbRecord.platform === null ||
      this.dbRecord.platform === undefined
    ) {
      this.dbRecord.load_balancer_ip = '';
    }
    if (this.dbRecord.platform === 'netscaler') {
      this.isNetscaler = true;
    } else {
      this.isNetscaler = false;
    }
  }
  setLbList() {
    const tempList: string[] = [];
    const tempMap = new Map<string, List>();

    this.lbDbRecords.forEach((r) => {
      let cName: string;
      r.data.cluster_dns.forEach((d) => {
        if (d.includes('nsr.') || d.includes('lbc.')) {
          cName = d;
        }
      });
      const entry: List = {
        name: cName,
        ip: r.data.cluster_ip,
        mfr: r.data.mfr,
      };
      if (cName !== '' && cName !== undefined && cName !== null) {
        tempMap.set(cName, entry);
        tempList.push(cName);
      }
    });
    tempList.sort();
    const uniqueList = Array.from(new Set(tempList));
    uniqueList.forEach((r) => {
      this.mapLb.set(tempMap.get(r).ip, tempMap.get(r));
      this.listLb.push(tempMap.get(r));
    });
  }
  commit() {
    this.vsDataSource.create(this.dbRecord);
    this.close();
  }
  close() {
    this.dialogRef.close();
  }
  onSubmit(f: NgForm) {
    if (f.valid === false) {
      this._snackBar.open('Error: Required fields are still blank', 'Close', {
        duration: 10000,
      });
    } else {
      this._snackBar.open('Create request submitted: '+this.dbRecord.data.name, 'Close', {
        duration: 10000,
      });
      this.commit();
    }
  }
  pInt(v: string): number {
    return Number(v);
  }
  defaultPortRequired(p: number): boolean {
    for (const i of this.dbRecord.data.pools[p].bindings) {
      if (i.port === undefined || i.port === 0) {
        return true;
      }
    }
    return false;
  }
  bindingPortRequired(p: number): boolean {
    const d = this.dbRecord.data.pools[p].default_port;
    if (d === undefined || d === 0) {
      return true;
    }
    return false;
  }
  clearPersistence(p: number): void {
    if (this.dbRecord.data.pools[p].persistence !== undefined) {
      this.dbRecord.data.pools[p].persistence = undefined;
    }
    return;
  }
  trimBindings(v: boolean, p: number): void {
    if (v === false) {
      return;
    }
    for (let i = 0; i < this.dbRecord.data.pools[p].bindings.length; i++) {
      if (i !== 0) {
        this.removeBinding(p, i);
      }
    }
  }
}
