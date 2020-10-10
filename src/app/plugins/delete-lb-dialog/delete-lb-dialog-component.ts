import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbRecord } from '../../models/lb.model';
import { LbService, LbServiceDs } from 'src/app/services/lb.service';
@Component({
  selector: 'app-delete-lb-dialog',
  templateUrl: './delete-lb-dialog-component.html',
  styleUrls: ['./delete-lb-dialog-component.css'],
})
export class DeleteLbDialogComponent implements OnInit {
    //////////////////////////////////////////////////////////////////////////////
    constructor(
      @Inject(MAT_DIALOG_DATA) public source: DbRecord,
      public lbService: LbService,
      public dialogRef: MatDialogRef<DeleteLbDialogComponent>,
      private snackBar: MatSnackBar,
    ) {}
    //////////////////////////////////////////////////////////////////////////////
    dataSource: LbServiceDs;
    //////////////////////////////////////////////////////////////////////////////
    ngOnInit(): void {
      this.dataSource = new LbServiceDs(this.lbService, this.snackBar);
    }
    //////////////////////////////////////////////////////////////////////////////
    commit() {
      this.dataSource.delete(this.source);
      this.close();
    }
    //////////////////////////////////////////////////////////////////////////////
    close() {
      this.dialogRef.close();
    }
}
