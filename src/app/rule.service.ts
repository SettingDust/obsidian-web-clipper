import {Injectable} from '@angular/core';
import {filter, first, from, Observable} from 'rxjs';
import {URLPattern} from 'urlpattern-polyfill';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor() {
  }

  /**
   * All rule that success with url
   * @param url
   */
  get = (url: string): Observable<Rule> => from(browser.storage.local.get('rules').then(it => it.rules)).pipe(
    filter(it => !!new URLPattern(it).exec(url))
  )

  last = (url: string): Observable<Rule> => this.get(url).pipe(first())
}

export interface Rule {
  patterns: string[],
  selector?: string,
  unwanted?: string[]
}
