import { Injectable } from '@angular/core'
import { i18n } from './i18n.pipe'
import { from, Observable, Subject, switchMap } from 'rxjs'
import { ExtensionService } from './extension.service'
import { map, tap } from 'rxjs/operators'
import { Rule } from './rule.service'

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

  set<T extends OptionKeys>(value: {
    [key in T]: Options[key]
  }) {
    return from(browser.storage.local.set(value))
  }

  get<T extends OptionKeys>(key: T) {
    return from(<Promise<Pick<Options, T>>>browser.storage.local.get(key)).pipe(map((it) => it[key]))
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
        tap((changes) => {
          const result = <Options>{}
          for (const key in changes) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result[key] = changes[key]?.newValue
          }
          this._onChange.next(result)
        }),
        switchMap(() => this.options.pipe(tap((it) => console.debug('[options:change]', it))))
      )
      .subscribe()
  }
}
