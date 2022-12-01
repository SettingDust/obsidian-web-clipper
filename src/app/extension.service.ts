import { Injectable } from '@angular/core'
import { filter, map } from 'rxjs/operators'
import { from, Observable } from 'rxjs'
import { ActionData, ActionDataType, ActionMessage, Actions } from '../action'
import { ExportData } from './article-extractor.service'
import MessageSender = browser.runtime.MessageSender

@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  private $listener = new Observable<unknown>((subscriber) =>
    browser.runtime.onMessage.addListener((message, sender, respond) => subscriber.next({ message, sender, respond }))
  )

  message = {
    onReceive: <T extends ContentAction>() => this.$listener as Observable<ContentMessageListener<T>>,
    onAction: <T extends ContentAction>(action: T) =>
      this.message.onReceive<T>().pipe(
        filter(({ message }) => message.action === action),
        map(
          ({ message, sender, respond }) =>
            ({
              message: message.data,
              sender,
              respond
            } as ContentMessageListener<T> & { message: ContentActionMessage<T, 'receive'>['data'] })
        )
      ),
    action: <
      T extends ContentAction,
      U extends ContentActionMessage<T, 'send'>['data'] = ContentActionMessage<T, 'send'>['data']
    >(
      tab: number,
      action: T,
      data?: U
    ): Observable<ContentActionMessage<T, 'receive'>> => from(browser.tabs.sendMessage(tab, { action, data }))
  }

  tab = {
    create: (options: { url: string; active?: boolean }) => from(browser.tabs.create({ active: false, ...options })),
    warmup: (id: number) => from(browser.tabs.warmup(id)).pipe(map(() => id))
  }

  private $change = new Observable<[changes: { [key: string]: browser.storage.StorageChange }, area: string]>(
    // eslint-disable-next-line unicorn/consistent-function-scoping
    (subscriber) => browser.storage.onChanged.addListener((change, area) => subscriber.next([change, area]))
  )

  storage = {
    onChange: <T extends Record<string, unknown>, U extends keyof T = keyof T>(name: 'local' | 'sync' | 'managed') =>
      this.$change.pipe(
        filter(([, area]) => area === name),
        map(([change]) => <Partial<{ [key in U]: browser.storage.StorageChange }>>change)
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
