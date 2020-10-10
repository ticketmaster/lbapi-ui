import {
  DbRecord,
  HealthMonitor,
  Binding,
  Port,
  Pool,
  Persistence,
  Certificate,
} from '../../models/vs.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from 'src/app/common/global-constants';
import { VsService, VsServiceDs } from 'src/app/services/vs.service';
//
@Component({
  selector: 'app-edit-vs-dialog',
  templateUrl: 'edit-vs-dialog.html',
  styleUrls: ['edit-vs-dialog.css', '../../global.css'],
})
//
export class EditVsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditVsDialogComponent>,
    public vsService: VsService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public source: DbRecord
  ) {}
  dataSource: VsServiceDs;
  apiUri = GlobalConstants.apiURL;
  panelOpenState = false;
  vsEnabledText: string;
  jsonDbRecord = JSON.stringify(this.source);
  dbRecord = JSON.parse(this.jsonDbRecord) as DbRecord;
  entryComponents: [EditVsDialogComponent];
  isNetscaler: boolean;
  port: Port = {
    ssl_enabled: false,
  };
  binding: Binding = {
    enabled: false,
    server: {},
  };
  monitor: HealthMonitor = {
    receive_timeout: 15,
    response_codes: [],
    send_interval: 30,
    successful_count: 1,
    type: 'tcp',
  };
  persistence: Persistence = {};
  pool: Pool = {
    bindings: [this.binding],
    enabled: false,
    weight: 1,
    health_monitors: [this.monitor],
    name: '(New)',
    persistence: this.persistence,
    ssl_enabled: false,
  };
  certificate: Certificate = {
    key: {},
  };
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public updateFields(event: MatSelectChange, p: number, h: number): void {
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
  public updateCertificate(event: any, type: string) {
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
  public addResponseCode(event: MatChipInputEvent, p: number, h: number): void {
    const input = event.input;
    const value = event.value;
    const components: string[] = [];
    if (
      this.dbRecord.data.pools[p].health_monitors[h].response_codes ===
        undefined ||
      this.dbRecord.data.pools[p].health_monitors[h].response_codes === null
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
    console.log(input.value);
  }
  public addPool(): void {
    const jsonPool = JSON.stringify(this.pool);
    const pool = JSON.parse(jsonPool) as Pool;
    if (this.dbRecord.data.pools === undefined) {
      const pools: Pool[] = [pool];
      this.dbRecord.data.pools = pools;
      return;
    }
    this.dbRecord.data.pools.push(pool);
  }
  public addPort(): void {
    const jsonPort = JSON.stringify(this.port);
    const port = JSON.parse(jsonPort) as Port;
    this.dbRecord.data.ports.push(port);
  }
  public addBinding(p: number): void {
    const bindings: Binding[] = [];
    const jsonBinding = JSON.stringify(this.binding);
    const binding = JSON.parse(jsonBinding) as Binding;
    if (this.dbRecord.data.pools[p].bindings === undefined) {
      this.dbRecord.data.pools[p].bindings = bindings;
    }
    this.dbRecord.data.pools[p].bindings.push(binding);
  }
  public addHealthMonitor(p: number): void {
    const jsonMonitor = JSON.stringify(this.monitor);
    const monitor = JSON.parse(jsonMonitor) as HealthMonitor;
    if (
      this.dbRecord.data.pools[p].health_monitors === null ||
      this.dbRecord.data.pools[p].health_monitors === undefined
    ) {
      this.dbRecord.data.pools[p].health_monitors = [];
    }
    this.dbRecord.data.pools[p].health_monitors.push(monitor);
  }
  public removePort(p: number): void {
    const index = p;
    if (index >= 0) {
      this.dbRecord.data.ports.splice(index, 1);
    }
  }
  public removeBinding(p: number, b: number): void {
    const index = b;
    if (index >= 0) {
      this.dbRecord.data.pools[p].bindings.splice(index, 1);
    }
  }
  public removeHealthMonitor(p: number, h: number): void {
    const index = h;
    if (index >= 0) {
      this.dbRecord.data.pools[p].health_monitors.splice(index, 1);
    }
  }
  public removePool(p: number): void {
    const index = p;
    if (index >= 0) {
      this.dbRecord.data.pools.splice(index, 1);
    }
  }
  public removeResponseCode(responseCode: string, p: number, h: number): void {
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
  public testLength() {
    return true;
  }
  public ngOnInit() {
    this.dataSource = new VsServiceDs(this.vsService, this.snackBar);
    if (this.dbRecord._load_balancer.mfr === 'netscaler') {
      this.isNetscaler = true;
    }
  }
  public commit() {
    this.dataSource.modify(this.dbRecord);
    this.close();
  }
  public close() {
    this.dialogRef.close();
  }
  public onSubmit(f: NgForm) {
    if (f.valid === false) {
      this.snackBar.open('Error: Required fields are still blank', 'Close', {
        duration: 10000,
      });
    } else {
      this.commit();
    }
  }
  public pInt(v: string): number {
    return Number(v);
  }
  public addDnsRecord(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const components: string[] = [];
    if (
      this.dbRecord.data.dns === undefined ||
      this.dbRecord.data.dns === null
    ) {
      this.dbRecord.data.dns = [];
    }
    if ((value || '').trim()) {
      this.dbRecord.data.dns.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    console.log(input.value);
  }
  public removeDnsRecord(v: string): void {
    const index = this.dbRecord.data.dns.indexOf(v);
    if (index >= 0) {
      this.dbRecord.data.dns.splice(index, 1);
    }
  }
  public defaultPortRequired(p: number): boolean {
    for (const i of this.dbRecord.data.pools[p].bindings) {
      if (i.port === undefined || i.port === 0) {
        return true;
      }
    }
    return false;
  }
  public bindingPortRequired(p: number): boolean {
    const d = this.dbRecord.data.pools[p].default_port;
    if (d === undefined || d === 0) {
      return true;
    }
    return false;
  }
  public clearPersistence(p: number): void {
    if (this.dbRecord.data.pools[p].persistence !== undefined) {
      this.dbRecord.data.pools[p].persistence = undefined;
    }
    return;
  }
  public trimBindings(v: boolean, p: number): void {
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
