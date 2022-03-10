import {ActionData} from "projects/common/src/action"
import $background from "./background-listener"
import {getSelectionHtml} from "./utils"
import {storage} from './browser';
import {filter, map} from 'rxjs/operators';
import {concat} from 'rxjs';
import {KeyBindingMap} from 'tinykeys';
import * as hotkeys from "./hotkeys";

export type ExportBackgroundAction = ActionData<undefined, {
  document: string
  url: string
  selection?: string,
  path: string
}>

function registerHotkeys(paths: { hotkey: string, path: string }[]) {
  hotkeys.unsubscribe()
  const keys: KeyBindingMap = {}
  for (const {hotkey, path} of paths) {
    keys[hotkey] = () => $background.message.action('export', {
      document: document.documentElement.outerHTML,
      url: window.location.href,
      selection: getSelectionHtml(),
      path
    })
  }
  hotkeys.subscribe(window, keys)
}

concat(
  browser.storage.local.get('paths').then(it => it.paths),
  storage.change('local').pipe(
    filter(change => !!change.paths),
    map(change => change.paths.newValue as { [key: string]: { hotkey: string, path: string }[] })
  )
).subscribe(registerHotkeys)

