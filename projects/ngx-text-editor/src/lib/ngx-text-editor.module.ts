import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTextEditorComponent } from './ngx-text-editor.component';



@NgModule({
  declarations: [
    NgxTextEditorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  exports: [
    NgxTextEditorComponent
  ]
})
export class NgxTextEditorModule { }
