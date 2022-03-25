import { ActionData } from '../action'
import $background from './background-listener'

$background.message.actionListener('error').subscribe(({ message, sender, respond }) => {
  console.warn(message)
  respond()
})

export type ErrorBackgroundAction = ActionData<
  {
    message: string
  },
  undefined
>
