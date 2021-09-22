import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BackgroundRoutingModule} from './background-routing.module';
import {BackgroundComponent} from './background.component';


@NgModule({
  declarations: [
    BackgroundComponent
  ],
  imports: [
    CommonModule,
    BackgroundRoutingModule
  ],
  providers: []
})
export class BackgroundModule {
}
