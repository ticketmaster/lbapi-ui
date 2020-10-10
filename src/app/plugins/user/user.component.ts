import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UserComponent>,
    public token: TokenService
  ) {}
  expiry: string;
  productCodes: number[] = [];

  public ngOnInit(): void {
    this.token.get();
    let newDate = new Date();
    newDate.setTime(this.token.token.exp * 1000);
    this.expiry = newDate.toLocaleString('en-US');

    this.token.productCodes.forEach((v) => {
      this.productCodes.push(v);
    });
  }
  public saveMessage() {
    this.dialogRef.close();
  }
  public closeDialog() {
    this.dialogRef.close();
  }
}
