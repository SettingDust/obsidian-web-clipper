import { Injectable } from '@angular/core'
import { filter, first, from, Observable, switchMap } from 'rxjs'
import { ArticleExtractorService } from './article-extractor.service'
import { OptionService } from './option.service'

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  constructor(private optionService: OptionService, articleParserService: ArticleExtractorService) {
    optionService.onChange.subscribe(({ rules }) => {
      if (rules) articleParserService.rules(rules)
    })
  }

  /**
   * All rule that success with url
   * @param url
   */
  get = (url: string): Observable<Rule> =>
    this.optionService
      .get('rules')
      .pipe(
        switchMap((rules) =>
          from(rules).pipe(filter((rule) => rule.patterns.some((it) => new URLPattern(it).test(url))))
        )
      )

  first = (url: string): Observable<Rule> => this.get(url).pipe(first())
}

export interface Rule {
  patterns: string[]
  selector?: string[]
  ignored?: string[]
  template?: string
}
