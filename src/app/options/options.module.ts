import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OptionsRoutingModule} from './options-routing.module';
import {OptionsComponent} from './options.component';
import {ReactiveFormsModule} from "@angular/forms";
import {I18nPipe} from "../i18n.pipe";
import {
  TuiButtonModule, TuiDataListModule,
  TuiHintControllerModule,
  TuiHintModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {TuiDataListWrapperModule, TuiInputModule, TuiSelectModule, TuiTabsModule} from '@taiga-ui/kit';
import {TuiTableModule} from '@taiga-ui/addon-table';
import {ShortcutsComponent} from './shortcuts/shortcuts.component';
import {GeneralComponent} from './general/general.component';


@NgModule({
  declarations: [
    OptionsComponent,
    I18nPipe,
    ShortcutsComponent,
    GeneralComponent
  ],
  imports: [
    CommonModule,
    OptionsRoutingModule,
    ReactiveFormsModule,
    TuiHintControllerModule,
    TuiInputModule,
    TuiLinkModule,
    TuiTableModule,
    TuiButtonModule,
    TuiTabsModule,
    TuiSvgModule,
    TuiHintModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiSelectModule,
  ]
})
export class OptionsModule {
}
