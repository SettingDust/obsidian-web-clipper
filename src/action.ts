export interface ActionData<T, U> {
  receive?: T
  send?: U
}

export type ActionDataType = keyof ActionData<unknown, unknown>

export interface Actions {
  [key: string]: ActionData<unknown, unknown>
}

export interface ActionMessage<T extends Actions, U extends keyof T, V extends ActionDataType> {
  action: U
  data?: T[U][V]
}
