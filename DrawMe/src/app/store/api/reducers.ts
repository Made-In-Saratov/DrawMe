import drawMeApi from "@/store/api"
import baseApi from "@/store/api/base"

const reducers = {
  [drawMeApi.reducerPath]: drawMeApi.reducer,
}

export const middlewares = [baseApi.middleware] as const

export default reducers
