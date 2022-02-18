import {DoBootstrap, Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: []
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    if (!customElements.get('obsidian-web-clipper')) {
      customElements.define('obsidian-web-clipper',createCustomElement(AppComponent, {injector}));
    }
  }

  ngDoBootstrap() {
    const elem = document.createElement('obsidian-web-clipper')
    document.body.appendChild(elem)
  }
}
