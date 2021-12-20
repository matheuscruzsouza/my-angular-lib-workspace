import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTextEditorComponent } from './ngx-text-editor.component';

describe('NgxTextEditorComponent', () => {
  let component: NgxTextEditorComponent;
  let fixture: ComponentFixture<NgxTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
