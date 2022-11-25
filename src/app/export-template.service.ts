import { Injectable } from '@angular/core'
import { BrowserService } from './browser.service'
import { filter, map } from 'rxjs/operators'
import { RuleService } from './rule.service'
import { Observable } from 'rxjs'
import defaultTemplate from '../assets/default.template'
import { render } from 'micromustache'
import 'urlpattern-polyfill'

@Injectable({
  providedIn: 'root'
})
export class ExportTemplateService {
  private templates: { pattern: URLPatternInit | string; template: string }[] = []

  constructor(browserService: BrowserService, private ruleService: RuleService) {
    browserService.storage
      .change('local')
      .pipe(
        filter((it) => !!it.templates),
        map((it) => it.templates.newValue)
      )
      .subscribe((it) => (this.templates = it))
  }

  get defaultTemplate() {
    return defaultTemplate
  }

  get = (url: string) =>
    this.ruleService.first(url).pipe(map((it) => it?.template ?? this.defaultTemplate)) as Observable<string>

  render = (template: string, data: { title: string; url: string; content: string }) => render(template, data)
}
