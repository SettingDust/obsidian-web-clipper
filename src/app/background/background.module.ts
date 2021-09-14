import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BackgroundRoutingModule} from './background-routing.module';
import {BackgroundComponent} from './background.component';
import {BrowserService} from "./browser.service";
import {ObsidianService} from "./obsidian.service";


@NgModule({
  declarations: [
    BackgroundComponent
  ],
  imports: [
    CommonModule,
    BackgroundRoutingModule
  ],
  providers: [BrowserService, ObsidianService]
})
export class BackgroundModule {
}
