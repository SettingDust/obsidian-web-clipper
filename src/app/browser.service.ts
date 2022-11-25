import { Injectable } from '@angular/core'
import { filter, map } from 'rxjs/operators'
import { from, mapTo, Observable } from 'rxjs'
import { ActionData, ActionDataType, ActionMessage, Actions } from '../action'
import { ExportData } from './article-extractor.service'
import MessageSender = browser.runtime.MessageSender

@Injectable({
  providedIn: 'root'
})
export class BrowserService {
  private $listener = new Observable<ContentMessageListener<any>>((subscriber) =>
    browser.runtime.onMessage.addListener((message, sender, respond) => subscriber.next({ message, sender, respond }))
  )

  message = {
    listener: <T extends ContentAction>() => this.$listener as Observable<ContentMessageListener<T>>,
    actionListener: <T extends ContentAction>(action: T) =>
      this.message.listener<T>().pipe(
        filter(({ message }) => message.action === action),
        map(
          ({ message: { data }, sender, respond }) =>
            ({
              message: data,
              sender,
              respond
            } as ContentMessageListener<T> & { message: ContentActionMessage<T, 'receive'>['data'] })
        )
      ),
    action: <T extends ContentAction, U extends ContentActionMessage<T, 'send'>['data']>(
      tab: number,
      action: T,
      data?: U
    ): Observable<ContentActionMessage<T, 'receive'>> => from(browser.tabs.sendMessage(tab, { action, data }))
  }

  tab = {
    create: ({ url, active = false }: { url: string; active?: boolean }): Observable<browser.tabs.Tab> =>
      from(browser.tabs.create({ url, active })),
    warmup: (id: number) => from(browser.tabs.warmup(id)).pipe(mapTo(id))
  }

  private change$ = new Observable<[changes: { [key: string]: browser.storage.StorageChange }, area: string]>(
    (subscriber) => browser.storage.onChanged.addListener((change, area) => subscriber.next([change, area]))
  )

  storage = {
    change: (name: 'local' | 'sync' | 'managed'): Observable<{ [key: string]: browser.storage.StorageChange }> =>
      this.change$.pipe(
        filter(([, area]) => area === name),
        map(([change]) => change)
      )
  }
}

export interface ContentActions extends Actions {
  export: ActionData<ExportData, undefined>
}

export type ContentAction = keyof ContentActions

export type ContentActionMessage<T extends ContentAction, U extends ActionDataType> = ActionMessage<
  ContentActions,
  T,
  U
>

type ContentMessageListener<T extends ContentAction> = {
  message: ContentActionMessage<T, 'receive'>
  sender: MessageSender
  respond: (response?: ContentActionMessage<T, 'send'>) => void
}
