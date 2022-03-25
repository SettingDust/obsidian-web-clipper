import { Injectable } from '@angular/core'
import * as Eta from 'eta'
import { URLPatternInit } from 'urlpattern-polyfill/src/url-pattern.interfaces'
import { BrowserService } from '../browser.service'
import { filter, map } from 'rxjs/operators'
import { RuleService } from '../rule.service'
import { defaultIfEmpty, pluck } from 'rxjs'
import defaultTemplate from '../../assets/default.eta'

@Injectable({
  providedIn: 'root'
})
export class ExportTemplateService {
  private templates: { pattern: URLPatternInit; template: string }[] = []

  constructor(browserService: BrowserService, private ruleService: RuleService) {
    Eta.configure({
      tags: ['{{', '}}'],
      include: undefined,
      includeFile: undefined
    })

    browserService.storage
      .change('local')
      .pipe(
        filter((it) => !!it.templates),
        map((it) => it.templates.newValue)
      )
      .subscribe((it) => (this.templates = it))
  }

  get = (url: string) => this.ruleService.first(url).pipe(pluck('template'), defaultIfEmpty(defaultTemplate))

  render = (template: string, data: { title: string; url: string; content: string }) =>
    Eta.render(template, data, { async: false }) as string
}
