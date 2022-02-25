import {ActionData} from "projects/common/src/action"
import $background from "./background-listener"

export type ErrorBackgroundAction = ActionData<{
  message: string
}, undefined>

$background.message.action('error').subscribe(({message, sender, respond}) => {
  console.warn(message)
  respond()
})
