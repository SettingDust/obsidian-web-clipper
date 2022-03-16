import {Injectable} from '@angular/core';
import * as Eta from 'eta';
import {URLPatternInit} from 'urlpattern-polyfill/src/url-pattern.interfaces';
import {BrowserService} from './browser.service';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExportTemplateService {
  private templates: { pattern: URLPatternInit, template: string }[] = []

  constructor(browserService: BrowserService) {
    Eta.configure({
      tags: ['{{', '}}'],
      include: undefined,
      includeFile: undefined
    })

    browserService.storage.change('local').pipe(
      filter((it) => !!it.templates),
      map(it => it.templates.newValue)
    ).subscribe(it => this.templates = it)
  }

  render = (template: string, data: { title: string, url: string, content: string }) => Eta.render(template, data)
}

export interface TemplateData {
  pattern: URLPatternInit
  template: string
}
