import { TestBed } from '@angular/core/testing';

import { NgxGundbService } from './ngx-gundb.service';

describe('NgxGundbService', () => {
  let service: NgxGundbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGundbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
