import {from} from "rxjs"
import {filter, map} from 'rxjs/operators';

from(['polyfills.js', 'main.js']).pipe(
  map(it => browser.runtime.getURL(`content-script/${it}`)),
  filter(it => !document.querySelector(`script[src="${it}"]`))
).subscribe((path) => {
  const elem = document.createElement('script')
  elem.src = path
  document.body.appendChild(elem)
})
