export interface ActionData<T, U> {
  receive?: T,
  send?: U
}

export type ActionDataType = keyof ActionData<any, any>

export interface Actions {
  [key: string]: ActionData<any, any>
}

export interface ActionMessage<T extends Actions, U extends keyof T, V extends ActionDataType> {
  action: U
  data?: T[U][V]
}
