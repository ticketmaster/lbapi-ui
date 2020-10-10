import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbRecord } from '../models/vs.model';
import { Injectable } from '@angular/core';
import { EditVsDialogComponent } from '../plugins/edit-vs-dialog/edit-vs-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class EditVsDialogService {
  constructor(public dialog: MatDialog) {}
  public openDialog(dbRecord: DbRecord) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '95%';
    dialogConfig.minWidth = '90%';
    dialogConfig.maxHeight = '95%';
    dialogConfig.data = dbRecord;
    dialogConfig.disableClose = true;
    this.dialog.open(EditVsDialogComponent, dialogConfig);
  }
}
