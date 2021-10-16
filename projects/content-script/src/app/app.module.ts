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
  providers: [],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const elm = createCustomElement(AppComponent, {injector: this.injector});
    if (!customElements.get('obsidian-web-clipper')) {
      customElements.define('obsidian-web-clipper', elm);
    }
  }

  ngDoBootstrap() {
    const elem = document.createElement('obsidian-web-clipper')
    document.body.appendChild(elem)
  }
}
