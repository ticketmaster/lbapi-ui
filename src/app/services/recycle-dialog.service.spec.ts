import { TestBed } from '@angular/core/testing';

import { RecycleDialogService } from './recycle-dialog.service';

describe('RecycleDialogService', () => {
  let service: RecycleDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecycleDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
