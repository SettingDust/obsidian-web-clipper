import {Injectable} from '@angular/core';
import {filter} from "rxjs/operators";
import {from, mapTo, Observable} from 'rxjs';
import Tab = browser.tabs.Tab;

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  private command$ = new Observable<string>(subscriber => browser.commands.onCommand.addListener(it => subscriber.next(it)))

  command = (command: Commands) => this.command$.pipe(filter(it => it === command))

  action = <T extends Action>([tab, action]: [number, T]): Observable<ActionMessage<T>> =>
    from(browser.tabs.sendMessage(tab, {action}))

  tab = {
    create: ({url, active = false}: { url: string, active?: boolean }): Observable<Tab> =>
      from(browser.tabs.create({url, active})),
    warmup: (id: number) => from(browser.tabs.warmup(id)).pipe(mapTo(id))
  }
}

export type Commands = 'export'

export interface ActionMessage<T extends Action> {
  action: T,
  data: ActionData[T]
}

export type Action = keyof ActionData

export interface ActionData {
  'export': ExportData
}

export interface ExportData {
  document: string,
  url: string,
  selection?: string
}
