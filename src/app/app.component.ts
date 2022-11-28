import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { i18n } from './i18n.pipe'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(title: Title) {
    title.setTitle(i18n('extensionName'))
  }
}
