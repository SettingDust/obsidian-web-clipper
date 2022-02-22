import {filter, Observable} from "rxjs";
import {ActionDataType, ActionMessage, Actions} from "projects/common/src/action"
import {ExportBackgroundAction} from './export-action';
import MessageSender = browser.runtime.MessageSender;
import {ErrorBackgroundAction} from './error-action';

export interface BackgroundActions extends Actions {
  export: ExportBackgroundAction,
  error: ErrorBackgroundAction
}

type BackgroundAction = keyof BackgroundActions

type BackgroundActionMessage<T extends BackgroundAction, U extends ActionDataType> = ActionMessage<BackgroundActions, T, U>

type BackgroundMessageListener<T extends BackgroundAction> = {
  message: BackgroundActionMessage<T, 'receive'>
  sender: MessageSender
  respond: (response?: BackgroundActionMessage<T, 'send'>) => void
}

const $listener = new Observable<BackgroundMessageListener<any>>(subscriber =>
  browser.runtime.onMessage.addListener((
      message,
      sender,
      respond
    ) => subscriber.next({message, sender, respond})
  )
)

const $background = {
  message: {
    listener: <T extends BackgroundAction>() => $listener as Observable<BackgroundMessageListener<T>>,
    action: <T extends BackgroundAction>(action: T) => $background.message.listener<T>().pipe(
      filter(({message}) => message.action === action),
    )
  }
}

export default $background
