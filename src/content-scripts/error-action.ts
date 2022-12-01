import { ActionData } from '../action'

export type ErrorBackgroundAction = ActionData<
  {
    message: unknown
  },
  undefined
>
