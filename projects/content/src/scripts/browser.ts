import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

const change$ = new Observable<[changes: { [key: string]: browser.storage.StorageChange }, area: string]>(
  ({next}) => browser.storage.onChanged.addListener((change, area) => next([change, area]))
)

export const storage = {
  change: (name: 'local' | 'sync' | 'managed'): Observable<{ [key: string]: browser.storage.StorageChange }> =>
    change$.pipe(
      filter(([, area]) => area === name),
      map(([change]) => change)
    )
}
