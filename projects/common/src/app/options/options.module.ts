import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OptionsRoutingModule} from './options-routing.module';
import {OptionsComponent} from './options.component';
import {ReactiveFormsModule} from "@angular/forms";
import {I18nPipe} from "../i18n.pipe";


@NgModule({
  declarations: [
    OptionsComponent,
    I18nPipe
  ],
  imports: [
    CommonModule,
    OptionsRoutingModule,
    ReactiveFormsModule
  ]
})
export class OptionsModule { }
