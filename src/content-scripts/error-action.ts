import { ActionData } from '../action'
import $background from './background-listener'

$background.message.actionListener('error').subscribe(({ message, respond }) => {
  // TODO: popup of error
  console.warn('[obsidian-web-clipper:error]', message)
  respond()
})

export type ErrorBackgroundAction = ActionData<
  {
    message: unknown
  },
  undefined
>
