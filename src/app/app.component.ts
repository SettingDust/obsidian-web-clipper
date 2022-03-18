import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {I18nPipe} from './i18n.pipe';
import {from} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(title: Title, i18n: I18nPipe) {
    title.setTitle(i18n.transform('extensionName'))

    // TODO Action types
    from(browser.storage.local.get({
      vault: '',
      shortcuts: [
        {
          shortcut: 'o p',
          action: 'option'
        },
        {
          shortcut: 'r l',
          action: 'export',
          path: 'ReadLater'
        },
        {
          shortcut: 'm o',
          action: 'export',
          path: 'Memo'
        }
      ]
    })).subscribe(it => browser.storage.local.set(it))
  }
}
