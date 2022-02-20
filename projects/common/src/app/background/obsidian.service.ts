import {Injectable} from '@angular/core';
import {combineLatest, from, mapTo, of, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObsidianService {
  private BASE_URL = "obsidian://"

  api = <Action extends keyof Actions>(action: Action, data: Actions[Action]) =>
    of(new URL(`${this.BASE_URL}${action}`)).pipe(
      switchMap(url => combineLatest([
          of(url.searchParams),
          from(Object.entries(data))
        ]).pipe(
          tap(([params, [key, value]]) => params.append(key, String(value))),
          mapTo(url)
        )
      )
    )

  plusToSpace = (url: string) => url.replace(/\+/g, '%20')
}

type VaultAction = {
  /**
   * Can be either the vault name, or the vault ID. If not provided, the current or last focused vault will be used.
   */
  vault?: string
}

interface Actions {
  new: VaultAction & {
    /**
     * The file name to be created.
     * If this is specified, the file location will be chosen based on your "Default location for new notes" preferences.
     */
    name?: string
    /**
     * A vault absolute path, including the name.
     * Will override ${name} if specified.
     * @see {name}
     */
    file?: string
    /**
     * A globally absolute path.
     * Works similar to the path option in the open action, which will override both vault and file.
     */
    path?: string
    content?: string
    /**
     * Set this if you don't want to open the new note.
     */
    silent?: boolean
  }
}
