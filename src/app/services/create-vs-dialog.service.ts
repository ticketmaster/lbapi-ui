import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbRecord } from '../models/vs.model';
import { Injectable } from '@angular/core';
import { CreateVsDialogComponent } from '../plugins/create-vs-dialog/create-vs-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class CreateVsDialogService {
  constructor(public dialog: MatDialog) {}
  rec: DbRecord = {
    platform: 'avi networks',
    load_balancer_ip: '',
    data: {
      dns: [],
      enabled: true,
      load_balancing_method: 'roundrobin',
      pools: [
        {
          bindings: [
            {
              enabled: true,
              server: {
              },
            },
          ],
          weight:1,
          certificate: {},
          enabled: true,
          health_monitors: [],
          name: '(New)',
          ssl_enabled: false,
        },
      ],
      ports: [{ port: 80, ssl_enabled: undefined, l4_profile: 'tcp' }],
      service_type: 'http',
    },
  };
  public openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '95%';
    dialogConfig.minWidth = '90%';
    dialogConfig.maxHeight = '95%';
    dialogConfig.data = this.rec;
    dialogConfig.disableClose = true;
    this.dialog.open(CreateVsDialogComponent, dialogConfig);
  }
}
