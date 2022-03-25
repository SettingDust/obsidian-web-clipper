import { ActionData } from '../action'

export type ExportBackgroundAction = ActionData<
  undefined,
  {
    document: string
    url: string
    selection?: string
    path: string
  }
>
