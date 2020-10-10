import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSheetComponent } from './filter-sheet.component';

describe('FilterSheetComponent', () => {
  let component: FilterSheetComponent;
  let fixture: ComponentFixture<FilterSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
