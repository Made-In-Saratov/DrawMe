import { createApi } from "@reduxjs/toolkit/dist/query/react"

import { drawMeBaseQuery } from "./helpers"

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: drawMeBaseQuery,
  tagTypes: [],
  endpoints: () => ({}),
})

export default baseApi
