import {ActionData} from "projects/common/src/action"
import $background from "./background-listener"

export type ExportBackgroundAction = ActionData<undefined, {
  document: string
  url: string
  selection?: string
}>

$background.message.action('export').subscribe(({message: {action}, respond}) => respond({
  action,
  data: {
    document: document.documentElement.outerHTML,
    url: window.location.href,
    selection: getSelectionHtml()
  }
}))
