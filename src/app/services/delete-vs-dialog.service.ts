import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbRecord } from '../models/vs.model';
import { Injectable } from '@angular/core';
import { DeleteVsDialogComponent } from '../plugins/delete-vs-dialog/delete-vs-dialog-component';

@Injectable({
  providedIn: 'root',
})
export class DeleteVsDialogService {
  constructor(public dialog: MatDialog) {}

  public openDialog(dbRecord: DbRecord) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dbRecord;
    this.dialog.open(DeleteVsDialogComponent, dialogConfig);
  }
}
