import {
  MatBottomSheet, MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { Filter } from '../models/vs.model';
import { Injectable } from '@angular/core';
import { FilterSheetComponent } from '../plugins/filter-sheet/filter-sheet.component';

@Injectable({
  providedIn: 'root',
})
export class FilterSheetService {
  constructor(public bottomSheet: MatBottomSheet) {}

  public open(f: Filter[]): void {
    const config = new MatBottomSheetConfig();
    config.data = f;
    this.bottomSheet.open(FilterSheetComponent, config);
  }
}
