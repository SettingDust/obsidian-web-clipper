import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OptionsRoutingModule} from './options-routing.module';
import {OptionsComponent} from './options.component';
import {ReactiveFormsModule} from "@angular/forms";
import {I18nPipe} from "../i18n.pipe";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    OptionsComponent,
    I18nPipe
  ],
  imports: [
    CommonModule,
    OptionsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class OptionsModule { }
