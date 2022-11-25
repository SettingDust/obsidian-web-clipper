import { Injectable } from '@angular/core'
import { combineLatestWith, defaultIfEmpty, from, of, tap } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Rule } from './rule.service'
import { contentSelectors, extract } from '@settingdust/article-extractor'
import { relativeToAbsolute } from '@availity/resolve-url'

@Injectable({
  providedIn: 'root'
})
export class ArticleExtractorService {
  constructor() {}

  rules = (rules: Rule[]) =>
    rules.forEach((rule) => {
      for (const pattern of rule.patterns)
        if (rule.selector) contentSelectors.set(new URLPattern(pattern), <Rule & { selector: string[] }>rule)
    })

  extract = ({ url, document, selection }: ExportData) =>
    from(extract(document, { url })).pipe(
      combineLatestWith(
        of(selection).pipe(
          filter((selection): selection is string => !!selection),
          map((it) => this.absolutifyDocument(new DOMParser().parseFromString(it, 'text/html'), url)),
          defaultIfEmpty(undefined)
        )
      ),
      tap((it) => {
        console.debug('[article-extractor:raw:extractor]', it[0])
        console.debug('[article-extractor:raw:selection]', it[1])
      }),
      tap(([result, selection]) => (result.content = selection?.documentElement?.outerHTML ?? result?.content)),
      map(([result]) => result)
    )

  private absolutifyDocument = (document: Document, baseUrl = document.baseURI) => {
    for (const element of Array.from(document.querySelectorAll('a'))) {
      const href = element.getAttribute('href')
      if (href) element.setAttribute('href', relativeToAbsolute(href, baseUrl))
    }

    for (const element of Array.from(document.querySelectorAll('img'))) {
      const source = element.dataset.src ?? element.getAttribute('src')
      if (source) element.setAttribute('src', relativeToAbsolute(source, baseUrl))
    }

    return document
  }
}

export interface ExportData {
  document: string
  url: string
  selection?: string
  path?: string
}
