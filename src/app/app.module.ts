import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    from(browser.storage.local.get({vault: '', paths: []})).pipe(
      tap(it => {
        if (!it.paths.length) it.paths = [
          {hotkey: 'r l', path: 'ReadLater'},
          {hotkey: 'm o', path: 'Memo'}
        ]
      })
    ).subscribe(it => browser.storage.local.set(it))
  }
}
