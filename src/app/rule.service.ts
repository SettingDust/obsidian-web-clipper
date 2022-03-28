import { Injectable } from '@angular/core'
import { filter, first, from, Observable, pluck } from 'rxjs'
import { URLPattern } from 'urlpattern-polyfill'
import { BrowserService } from './browser.service'
import { ArticleParserService } from './article-parser.service'

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  constructor(browserService: BrowserService, articleParserService: ArticleParserService) {
    browserService.storage.change('local').pipe(pluck('rules', 'newValue')).subscribe(rules => articleParserService.rules(rules))
  }

  /**
   * All rule that success with url
   * @param url
   */
  get = (url: string): Observable<Rule> =>
    from(browser.storage.local.get('rules').then((it) => it.rules)).pipe(filter((it) => !!new URLPattern(it).exec(url)))

  first = (url: string): Observable<Rule> => this.get(url).pipe(first())
}

export interface Rule {
  patterns: string[]
  selector?: string
  unwanted?: string[]
  template?: string
}
