import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbRecord } from '../models/vs.model';
import { Injectable } from '@angular/core';
import { MigrateDialogComponent } from '../plugins/migrate-dialog/migrate-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class MigrateDialogService {
  constructor(public dialog: MatDialog) {}
  public openDialog(dbRecord: DbRecord) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dbRecord;
    dialogConfig.minWidth = 800;
    dialogConfig.disableClose = true;
    this.dialog.open(MigrateDialogComponent, dialogConfig);
  }
}
