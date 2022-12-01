import { Pipe, PipeTransform } from '@angular/core'

export function i18n(value: string, ...arguments_: unknown[]) {
  const result = browser.i18n.getMessage(value, arguments_)
  return result?.length ? result : value
}

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  transform(value: string, ...arguments_: unknown[]) {
    return i18n(value, ...arguments_)
  }
}
