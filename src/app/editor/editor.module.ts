import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorRoutingModule } from './editor-routing.module';

import { EditorComponent } from './editor.component';

import 'styles/editor.scss';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorRoutingModule
  ],
  declarations: [
    EditorComponent
  ],
  providers: [],
})
export class EditorModule { }
