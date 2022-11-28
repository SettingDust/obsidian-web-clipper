import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { RuleService } from './rule.service'
import { Observable } from 'rxjs'
import defaultTemplate from '../assets/default.template'
import render from 'mustache'
import { ArticleExtractorService } from './article-extractor.service'
import { ObservedValueOf } from 'rxjs/internal/types'

@Injectable({
  providedIn: 'root'
})
export class ExportTemplateService {
  constructor(private ruleService: RuleService) {}

  get defaultTemplate() {
    return defaultTemplate
  }

  get = (url: string) =>
    this.ruleService.first(url).pipe(map((it) => it?.template ?? this.defaultTemplate)) as Observable<string>

  render = (template: string, data: ObservedValueOf<ReturnType<ArticleExtractorService['extract']>>) =>
    render.render(template, data)
}
