import {Injectable} from '@angular/core';
import {extract} from 'article-parser';
import {combineLatest, combineLatestWith, defaultIfEmpty, from, mapTo, Observable, of, switchMap, tap} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import resolveUrl from '@availity/resolve-url';
import {ExportData} from './browser.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleParserService {

  constructor() {
  }

  extract = ({url, document, selection}: ExportData) => combineLatest([
    of(selection).pipe(
      filter((selection): selection is string => !!selection),
      this.parseDocument,
      combineLatestWith(of(url)),
      this.absolutify,
    ).pipe(defaultIfEmpty(() => undefined)) as Observable<Document | undefined>,
    extract(document)
  ]).pipe(
    switchMap(([selection, articleData]) => of(selection).pipe(
      filter((selection): selection is Document => !!selection),
      tap((selection) => articleData.content = selection.documentElement.outerHTML),
      mapTo(articleData)
    ).pipe(defaultIfEmpty(articleData)))
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
                of(resolveUrl({relative: value, base: baseUrl}) as unknown as string).pipe(
                  tap(absoluteUrl => // FIXME https://github.com/Availity/sdk-js/issues/486
                    element.setAttribute(attr, absoluteUrl as unknown as string)),
                  mapTo(document)
                )
              ))
          ))
        ))
      )
    ))
  )
}
