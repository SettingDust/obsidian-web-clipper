import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { I18nPipe } from './i18n.pipe'

@NgModule({
  declarations: [I18nPipe],
  exports: [I18nPipe],
  imports: [CommonModule]
})
export class SharedModule {}
