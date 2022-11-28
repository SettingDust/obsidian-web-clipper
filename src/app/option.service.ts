import { Injectable } from '@angular/core'
import { i18n } from './i18n.pipe'
import { from, Observable, Subject, switchMap } from 'rxjs'
import { ExtensionService } from './extension.service'
import { tap } from 'rxjs/operators'
import { Rule } from './rule.service'
import StorageChange = browser.storage.StorageChange

const defaultOptions = {
  shortcuts: [
    {
      shortcut: 'Alt+o Alt+p',
      action: <const>'option'
    },
    {
      shortcut: 'Alt+r Alt+l',
      action: <const>'export',
      path: i18n('optionShortcutReadLater')
    },
    {
      shortcut: 'Alt+m Alt+o',
      action: <const>'export',
      path: i18n('optionShortcutMemo')
    }
  ],
  rules: [
    <Rule>{
      patterns: ['*://foo.bar/*', '*://exam.ple/*'],
      selector: ['#Article'],
      ignored: ['.foo', '.bar']
    }
  ],
  api: {
    url: 'https://localhost:27124',
    token: ''
  }
}

export type Options = typeof defaultOptions
type OptionKeys = keyof Options

type IndexValue<T, K extends PropertyKey> = T extends unknown ? (K extends keyof T ? T[K] : never) : never

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  get options() {
    return from(<Promise<Options>>browser.storage.local.get(defaultOptions))
  }

  set options(value) {
    value
      .pipe(
        tap(({ api }) => {
          if (!api.url.endsWith('/')) api.url += '/'
        })
      )
      .subscribe((it) => browser.storage.local.set(it).then())
  }

  get<T extends OptionKeys>(key: T) {
    return from(<Promise<IndexValue<Options, T>>>browser.storage.local.get(key))
  }

  private _onChange = new Subject<Partial<Options>>()
  get onChange() {
    return this._onChange
  }

  constructor(browserService: ExtensionService) {
    // Init the defaults
    from(browser.storage.local.get(defaultOptions))
      .pipe(
        (it) => (this.options = <Observable<Options>>it),
        tap((it) => console.debug('[options:init]', it))
      )
      .subscribe()

    browserService.storage
      .onChange<Options>('local')
      .pipe(
        switchMap((changes) =>
          from(<[keyof Options, StorageChange][]>Object.entries(changes)).pipe(
            switchMap((change) => this.options.pipe(tap((it) => (it[change[0]] = change[1].newValue))))
          )
        )
      )
      .subscribe()
  }
}
