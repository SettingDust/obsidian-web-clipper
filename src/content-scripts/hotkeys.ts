import keybindings, {KeyBindingMap, KeyBindingOptions} from 'tinykeys';
import {concat, from, reduce, switchMap} from 'rxjs';
import {storage} from './browser';
import {filter, map, tap} from 'rxjs/operators';
import $background from './background-listener';
import {getSelectionHtml} from './utils';

export let unsubscribe: () => void = () => null

export const subscribe = (
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  options: KeyBindingOptions = {},
) => unsubscribe = keybindings(target, keyBindingMap, options)

const actions = {
  export: (data: any) => $background.message.action('export', {
    document: document.documentElement.outerHTML,
    url: window.location.href,
    selection: getSelectionHtml(),
    path: data?.path ?? ''
  }),
  option: () => $background.message.action('option')
}

concat<{ shortcut: string, action: 'export' | 'option', [key: string]: any }[][]>(
  browser.storage.local.get('shortcuts').then(it => it.shortcuts),
  storage.change('local').pipe(
    filter(change => !!change.shortcuts),
    map(change => change.shortcuts.newValue)
  )
).pipe(
  tap(unsubscribe),
  switchMap(it => from(it).pipe(
    reduce((acc, value) => ({
      ...acc,
      [value.shortcut]: () => actions[value.action](value)
    }), {} as KeyBindingMap)
  )),
).subscribe(data => subscribe(window, data))
