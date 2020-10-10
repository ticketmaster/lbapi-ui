import { TestBed } from '@angular/core/testing';

import { MigrateDialogService } from './migrate-dialog.service';

describe('MigrateDialogService', () => {
  let service: MigrateDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MigrateDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
