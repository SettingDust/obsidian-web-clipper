import { Injectable } from '@angular/core'
import { BrowserService } from '../browser.service'
import { filter, map } from 'rxjs/operators'
import { RuleService } from '../rule.service'
import { Observable, pluck } from 'rxjs'
import defaultTemplate from '../../assets/default.template'
import { render } from 'micromustache'
import { URLPatternInit } from 'urlpattern-polyfill'

@Injectable({
  providedIn: 'root'
})
export class ExportTemplateService {
  private templates: { pattern: URLPatternInit; template: string }[] = []

  constructor(browserService: BrowserService, private ruleService: RuleService) {
    browserService.storage
      .change('local')
      .pipe(
        filter((it) => !!it.templates),
        map((it) => it.templates.newValue)
      )
      .subscribe((it) => (this.templates = it))
  }

  get = (url: string) => this.ruleService.first(url).pipe(
    pluck('template'),
    map(it => it ?? defaultTemplate)
  ) as Observable<string>


  render = (template: string, data: { title: string; url: string; content: string }) => render(template, data)
}
