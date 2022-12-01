import { filter, from, Observable } from 'rxjs'
import { ActionData, ActionDataType, ActionMessage, Actions } from '../action'
import { ExportBackgroundAction } from './export-action'
import { ErrorBackgroundAction } from './error-action'
import MessageSender = browser.runtime.MessageSender

export interface BackgroundActions extends Actions {
  export: ExportBackgroundAction
  error: ErrorBackgroundAction
  option: ActionData<undefined, undefined>
}

type BackgroundAction = keyof BackgroundActions

type BackgroundActionMessage<T extends BackgroundAction, U extends ActionDataType> = ActionMessage<
  BackgroundActions,
  T,
  U
>

type BackgroundMessageListener<T extends BackgroundAction> = {
  message: BackgroundActionMessage<T, 'receive'>
  sender: MessageSender
  respond: (response?: BackgroundActionMessage<T, 'send'>) => void
}

const $listener = new Observable<unknown>((subscriber) =>
  browser.runtime.onMessage.addListener((message, sender, respond) => subscriber.next({ message, sender, respond }))
)

const $background = {
  message: {
    listener: <T extends BackgroundAction>() => $listener as Observable<BackgroundMessageListener<T>>,
    actionListener: <T extends BackgroundAction>(action: T) =>
      $background.message.listener<T>().pipe(filter(({ message }) => message.action === action)),
    action: <T extends BackgroundAction, U extends BackgroundActionMessage<T, 'send'>['data']>(
      action: T,
      data?: U
    ): Observable<BackgroundActionMessage<T, 'receive'>> => {
      console.debug(`[obsidian-web-clipper:action:${action}]`, data)
      return from(browser.runtime.sendMessage({ action, data }))
    }
  }
}

export default $background
