import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RulesRoutingModule } from './rules-routing.module'
import { RulesComponent } from './rules.component'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiTableModule } from '@taiga-ui/addon-table'
import { TuiAccordionModule, TuiBadgeModule, TuiInputModule, TuiTextAreaModule } from '@taiga-ui/kit'
import {
  TuiButtonModule,
  TuiGroupModule,
  TuiHintControllerModule,
  TuiNotificationModule,
  TuiTextfieldControllerModule,
  TuiTooltipModule
} from '@taiga-ui/core'
import { SharedModule } from '../../shared.module'

@NgModule({
  declarations: [RulesComponent],
  imports: [
    CommonModule,
    RulesRoutingModule,
    ReactiveFormsModule,
    TuiTableModule,
    TuiAccordionModule,
    TuiButtonModule,
    SharedModule,
    TuiBadgeModule,
    TuiGroupModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiHintControllerModule,
    TuiTooltipModule,
    TuiNotificationModule,
    TuiTextAreaModule
  ]
})
export class RulesModule {}
