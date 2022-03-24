import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {I18nPipe} from './i18n.pipe';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(title: Title, i18n: I18nPipe) {
    title.setTitle(i18n.transform('extensionName'))
  }
}
