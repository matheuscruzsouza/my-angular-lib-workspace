import { TestBed } from '@angular/core/testing';

import { NgxTextEditorService } from './ngx-text-editor.service';

describe('NgxTextEditorService', () => {
  let service: NgxTextEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTextEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
