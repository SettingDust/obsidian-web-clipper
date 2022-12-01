import keybindings, { KeyBindingMap, KeyBindingOptions } from 'tinykeys'
import { concat, from, reduce, switchMap } from 'rxjs'
import { storage } from './browser'
import { filter, map, tap } from 'rxjs/operators'
import $background from './background-listener'
import { getSelectionHtml } from './utils'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export let unregisterKeys: () => void = () => {}

export const registerKeys = (
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  options: KeyBindingOptions = {}
) => (unregisterKeys = keybindings(target, keyBindingMap, options))

const actions = {
  export: (data: unknown) =>
    $background.message.action('export', {
      document: document.documentElement.outerHTML,
      url: window.location.href,
      selection: getSelectionHtml(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      path: data?.path ?? ''
    }),
  option: () => $background.message.action('option')
}

concat<({ shortcut: string; action: 'export' | 'option'; [key: string]: unknown }[] | undefined)[]>(
  // eslint-disable-next-line unicorn/prefer-top-level-await
  browser.storage.local.get('shortcuts').then((it) => it.shortcuts),
  storage.change('local').pipe(map((change) => change?.shortcuts?.newValue))
)
  .pipe(
    filter((it): it is NonNullable<typeof it> => !!it),
    tap(() => unregisterKeys()),
    tap((it) => console.debug('[obsidian-web-clipper:shortcut:register]', it)),
    switchMap((it) =>
      from(it).pipe(
        reduce(
          (accumulator, value) => ({
            ...accumulator,
            [value.shortcut]: () => {
              console.debug('[obsidian-web-clipper:shortcut]', value)
              return actions[value.action](value)
            }
          }),
          <KeyBindingMap>{}
        )
      )
    )
  )
  .subscribe((data) => registerKeys(window, data))
