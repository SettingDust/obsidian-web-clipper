import {combineLatestWith, from, of} from "rxjs"
import {filter, map, tap} from 'rxjs/operators';

from(['polyfills.js', 'main.js']).pipe(
  map(path => browser.runtime.getURL(`content-script/${path}`)),
  filter(path => !!document.querySelector(`script[src="${path}"]`)),
  combineLatestWith(of(document.createElement('script'))),
  tap(([path, elem]) => elem.src = browser.runtime.getURL(`content-script/${path}`)),
  tap(([path, elem]) => document.body.appendChild(elem))
).subscribe()
