import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { RecycleDialogComponent } from '../plugins/recycle-dialog/recycle-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class RecycleDialogService {
  constructor(public dialog: MatDialog) {}
  public openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = 1000;
    dialogConfig.disableClose = false;
    this.dialog.open(RecycleDialogComponent, dialogConfig);
  }
}
