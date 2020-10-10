import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLbDialogComponent } from './delete-lb-dialog-component';

describe('ConfirmDeleteLbComponent', () => {
  let component: DeleteLbDialogComponent;
  let fixture: ComponentFixture<DeleteLbDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLbDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLbDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
