import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecycleDialogComponent } from './recycle-dialog.component';

describe('RecycleDialogComponent', () => {
  let component: RecycleDialogComponent;
  let fixture: ComponentFixture<RecycleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecycleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecycleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
