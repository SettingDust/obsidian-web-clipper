import { Injectable } from '@angular/core'
import { filter, first, from, Observable, pluck } from 'rxjs'
import { BrowserService } from './browser.service'
import { ArticleExtractorService } from './article-extractor.service'
import 'urlpattern-polyfill'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  constructor(browserService: BrowserService, articleParserService: ArticleExtractorService) {
    browserService.storage.change('local').pipe(map(it => it?.rules?.newValue)).subscribe(rules => articleParserService.rules(rules))
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
  selector?: string[]
  ignored?: string[]
  template?: string
}
