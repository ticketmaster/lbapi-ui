import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbRecord } from '../../models/vs.model';
import { VsService, VsServiceDs } from 'src/app/services/vs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-delete-vs-dialog',
  templateUrl: './delete-vs-dialog-component.html',
  styleUrls: ['./delete-vs-dialog-component.css'],
})
export class DeleteVsDialogComponent implements OnInit {
  //////////////////////////////////////////////////////////////////////////////
  constructor(
    @Inject(MAT_DIALOG_DATA) public source: DbRecord,
    public vsService: VsService,
    public dialogRef: MatDialogRef<DeleteVsDialogComponent>,
    private snackBar: MatSnackBar,
  ) {}
  //////////////////////////////////////////////////////////////////////////////
  dataSource: VsServiceDs;
  //////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.dataSource = new VsServiceDs(this.vsService, this.snackBar);
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
