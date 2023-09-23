import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"

import apiReducers, { middlewares } from "./api/reducers"

export const makeReduxStore = (state = {}) =>
  configureStore({
    reducer: {
      ...apiReducers,
    },
    middleware: base => base().concat(...middlewares),
    preloadedState: state,
  })

export type AppStore = ReturnType<typeof makeReduxStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
