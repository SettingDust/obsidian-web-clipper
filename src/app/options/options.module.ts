import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OptionsRoutingModule} from './options-routing.module';
import {OptionsComponent} from './options.component';
import {ReactiveFormsModule} from "@angular/forms";
import {
  TuiButtonModule,
  TuiDataListModule,
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
import {SharedModule} from '../shared.module';


@NgModule({
  declarations: [
    OptionsComponent,
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
    SharedModule
  ]
})
export class OptionsModule {
}
