import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbRecord } from '../models/lb.model';
import { Injectable } from '@angular/core';
import { DeleteLbDialogComponent } from '../plugins/delete-lb-dialog/delete-lb-dialog-component';

@Injectable({
  providedIn: 'root',
})
export class DeleteLbDialogService {
  constructor(public dialog: MatDialog) {}

  public openDialog(dbRecord: DbRecord) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dbRecord;
    this.dialog.open(DeleteLbDialogComponent, dialogConfig);
  }
}
