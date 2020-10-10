import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsTableComponent } from './vs-table.component';

describe('VsTableComponent', () => {
  let component: VsTableComponent;
  let fixture: ComponentFixture<VsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
