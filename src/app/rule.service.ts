import { Injectable } from '@angular/core'
import { filter, first, from, Observable } from 'rxjs'
import { BrowserService } from './browser.service'
import { ArticleExtractorService } from './article-extractor.service'
import 'urlpattern-polyfill'
import { map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  constructor(browserService: BrowserService, articleParserService: ArticleExtractorService) {
    browserService.storage
      .change('local')
      .pipe(
        tap((it) => console.debug('[config:change]: ', it)),
        map((it) => it?.rules?.newValue),
        filter(it => !!it)
      )
      .subscribe((rules) => articleParserService.rules(rules))
  }

  /**
   * All rule that success with url
   * @param url
   */
  get = (url: string): Observable<Rule> =>
    from(browser.storage.local.get('rules').then((it) => it.rules)).pipe(filter((it) => new URLPattern(it).test(url)))

  first = (url: string): Observable<Rule> => this.get(url).pipe(first())
}

export interface Rule {
  patterns: string[]
  selector?: string[]
  ignored?: string[]
  template?: string
}
