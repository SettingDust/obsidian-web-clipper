import {Injectable} from '@angular/core';
import {ArticleData, extract} from 'article-parser';
import {combineLatest, combineLatestWith, defaultIfEmpty, from, mapTo, Observable, of, switchMap, tap} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import resolveUrl from '@availity/resolve-url';

@Injectable({
  providedIn: 'root'
})
export class ArticleParserService {

  constructor() {
  }

  extract = ({url, document, selection}: ExportData): Observable<ArticleData> => combineLatest([
    of(selection).pipe(
      filter((selection): selection is string => !!selection),
      this.parseDocument,
      combineLatestWith(of(url)),
      this.absolutify,
    ).pipe(defaultIfEmpty(undefined)),
    extract(document)
  ]).pipe(
    switchMap(([selection, articleData]) => of(selection).pipe(
      tap((selection) => articleData.content = selection?.documentElement?.outerHTML ?? articleData.content),
      mapTo(articleData)
    ))
  )


  private RELATIVE_TAGS: { [key: string]: string[] } = {
    a: ['href'],
    img: ['src']
  }

  parseDocument = ($source: Observable<string>) => $source.pipe(map(html => new DOMParser().parseFromString(html, 'text/html')))

  absolutify = ($source: Observable<[Document, string]>) => $source.pipe(switchMap(([document, baseUrl]) =>
    of(this.RELATIVE_TAGS).pipe(
      map(value => Object.entries(value)),
      switchMap(value => from(value)),
      switchMap(([tag, attrs]) =>
        from(document.getElementsByTagName(tag)).pipe(switchMap(element =>
          from(attrs).pipe(switchMap(attr =>
            of(element.getAttribute(attr)).pipe(
              filter((value): value is string => !!value),
              switchMap(value =>
                of(resolveUrl({relative: value, base: baseUrl})).pipe(
                  tap(absoluteUrl => element.setAttribute(attr, absoluteUrl)),
                  mapTo(document)
                )
              )
            )
          ))
        ))
      )
    ))
  )
}

export interface ExportData {
  document: string
  url: string
  selection?: string
  path?: string
}
