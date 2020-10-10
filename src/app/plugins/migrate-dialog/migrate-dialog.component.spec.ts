import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateDialogComponent } from './migrate-dialog.component';

describe('MigrateDialogComponent', () => {
  let component: MigrateDialogComponent;
  let fixture: ComponentFixture<MigrateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigrateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
