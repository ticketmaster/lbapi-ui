import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbTableComponent } from './lb-table.component';

describe('VsTableComponent', () => {
  let component: LbTableComponent;
  let fixture: ComponentFixture<LbTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
