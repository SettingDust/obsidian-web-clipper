import {Injectable} from '@angular/core';
import {filter} from "rxjs/operators";
import {from, mapTo, Observable} from 'rxjs';
import {ActionData, ActionDataType, ActionMessage, Actions} from '../../action';
import {ExportData} from './article-parser.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  private command$ = new Observable<string>(subscriber => browser.commands.onCommand.addListener(it => subscriber.next(it)))

  command = (command: Commands) => this.command$.pipe(filter(it => it === command))

  action = <T extends ContentAction, U extends ContentActionMessage<T, 'send'>['data']>(
    tab: number,
    action: T,
    data?: U
  ): Observable<ContentActionMessage<T, 'receive'>> => from(browser.tabs.sendMessage(tab, {action, data}))

  tab = {
    create: ({url, active = false}: { url: string, active?: boolean }): Observable<browser.tabs.Tab> =>
      from(browser.tabs.create({url, active})),
    warmup: (id: number) => from(browser.tabs.warmup(id)).pipe(mapTo(id))
  }
}

export interface ContentActions extends Actions {
  export: ActionData<ExportData, undefined>
}

export type ContentAction = keyof ContentActions

export type ContentActionMessage<T extends ContentAction, U extends ActionDataType> = ActionMessage<ContentActions, T, U>

export type Commands = 'export'
