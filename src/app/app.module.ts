import {NgDompurifySanitizer} from "@tinkoff/ng-dompurify";
import {TUI_SANITIZER, TuiRootModule} from "@taiga-ui/core";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {I18nPipe} from './i18n.pipe';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule
  ],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}, I18nPipe],
  bootstrap: [AppComponent]
})
export class AppModule{

}
