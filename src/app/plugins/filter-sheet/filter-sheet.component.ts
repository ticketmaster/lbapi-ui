import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Filter } from 'src/app/models/vs.model';
import { FilterSheetService } from 'src/app/services/filter-sheet.service';

@Component({
  selector: 'app-filter-sheet',
  templateUrl: './filter-sheet.component.html',
  styleUrls: ['./filter-sheet.component.css']
})
export class FilterSheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public source: Filter[],
    private bottomSheetRef: MatBottomSheetRef<FilterSheetService>
  ) { }

  displayedColumns: string[] = ['key', 'value', 'notes'];

  ngOnInit(): void {
  }

  public close(s: Filter[]) {
    this.bottomSheetRef.dismiss();
  }

}
