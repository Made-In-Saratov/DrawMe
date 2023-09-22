import drawMeApi from "."
import baseApi from "./base"

const reducers = {
  [drawMeApi.reducerPath]: drawMeApi.reducer,
}

export const middlewares = [baseApi.middleware] as const

export default reducers
