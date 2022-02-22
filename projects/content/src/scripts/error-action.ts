import {ActionData} from "projects/common/src/action"
import $background from "./background-listener"

export type ErrorBackgroundAction = ActionData<{
  message: string
}, undefined>

$background.message.action('error').subscribe(error => console.warn(error))
