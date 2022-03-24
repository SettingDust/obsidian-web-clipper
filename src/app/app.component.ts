import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {I18nPipe} from './i18n.pipe';
import {from} from 'rxjs';
import {ArticleParserService} from './background/article-parser.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(title: Title, i18n: I18nPipe, articleParserService: ArticleParserService) {
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
          path: i18n.transform('optionShortcutReadLater')
        },
        {
          shortcut: 'm o',
          action: 'export',
          path: i18n.transform('optionShortcutMemo')
        }
      ],
      rules: [
        {
          patterns: ['*://foo.bar/*', '*://exam.ple/*'],
          selector: '#Article',
          unwanted: ['.foo', '.bar']
        }
      ]
    })).subscribe(it => {
      articleParserService.rules(it.rules)
      browser.storage.local.set(it).then()
    })
  }
}
