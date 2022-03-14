import {Component} from '@angular/core';
import {from} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor() {
    from(browser.storage.local.get({
      paths: [
        {hotkey: 'r l', path: 'ReadLater'},
        {hotkey: 'm o', path: 'Memo'}
      ]
    })).subscribe(it => browser.storage.local.set(it))
  }
}
