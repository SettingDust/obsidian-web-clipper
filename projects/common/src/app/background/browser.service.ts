import {Injectable} from '@angular/core';
import {filter} from "rxjs/operators";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  private command$ = new Observable<string>(subscriber => browser.commands.onCommand.addListener(command => subscriber.next(command)))

  command = (command: string) => new Observable(subscriber =>
    this.command$
      .pipe(filter(res => res === command))
      .subscribe(() => subscriber.next())
  )
}

export interface ExportMessage {
  action: 'export'
  data: {
    document: string,
    url: string,
    selection?: string
  }
}
