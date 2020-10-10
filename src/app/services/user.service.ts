import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { UserComponent } from '../plugins/user/user.component';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(public dialog: MatDialog) {}
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '25%';
    this.dialog.open(UserComponent, dialogConfig);
  }
}
