import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

const change$ = new Observable<[changes: { [key: string]: browser.storage.StorageChange }, area: string]>(
  (subscriber) => browser.storage.onChanged.addListener((change, area) => subscriber.next([change, area]))
)

export const storage = {
  change: (name: 'local' | 'sync' | 'managed') =>
    change$.pipe(
      filter(([, area]) => area === name),
      map(([change]) => change)
    )
}
