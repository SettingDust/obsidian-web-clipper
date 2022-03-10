import keybindings, {KeyBindingMap, KeyBindingOptions} from 'tinykeys';

export let unsubscribe: () => void = () => null

export const subscribe = (
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  options: KeyBindingOptions = {},
) => unsubscribe = keybindings(target, keyBindingMap, options)
