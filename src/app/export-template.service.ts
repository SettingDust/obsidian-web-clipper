import { Injectable } from '@angular/core'
import { RuleService } from './rule.service'
import defaultTemplate from '../assets/default.template'
import render from 'mustache'
import { ArticleExtractorService } from './article-extractor.service'
// eslint-disable-next-line rxjs/no-internal
import type { ObservedValueOf } from 'rxjs/internal/types'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ExportTemplateService {
  constructor(private ruleService: RuleService) {}

  get defaultTemplate() {
    return defaultTemplate
  }

  get = (url: string) => this.ruleService.first(url).pipe(map((it) => it.template ?? this.defaultTemplate))

  render = (template: string, data: ObservedValueOf<ReturnType<ArticleExtractorService['extract']>>) =>
    render.render(template, data)
}
