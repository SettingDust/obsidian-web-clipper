import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const result = browser.i18n.getMessage(value, args)
    return result?.length ? result : value
  }
}
