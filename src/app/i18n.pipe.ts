import { Pipe, PipeTransform } from '@angular/core'

export function i18n(value: string, ...args: unknown[]) {
  const result = browser.i18n.getMessage(value, args)
  return result?.length ? result : value
}

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]) {
    return i18n(value, ...args)
  }
}
