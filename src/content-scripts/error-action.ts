import {ActionData} from "../action"
import $background from "./background-listener"

export type ErrorBackgroundAction = ActionData<{
  message: string
}, undefined>

$background.message.actionListener('error').subscribe(({message, sender, respond}) => {
  console.warn(message)
  respond()
})
