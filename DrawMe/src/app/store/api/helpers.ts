import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query"

export const BASE_URL = "https://draw-me-backend.onrender.com/api"

type SchemaT<Keys extends string, Args extends Record<Keys, unknown>> = {
  [k in Keys]?: (arg: Args[k]) => string
}

export function withQueryParams<
  Keys extends string,
  Args extends Partial<Record<Keys, unknown>> = Partial<Record<Keys, unknown>>,
>({
  url,
  params,
  schema = {},
}: {
  url: string
  params: Args
  schema?: SchemaT<Keys, Args>
}): string {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      const fn = schema[key as Keys] ?? String
      return `${key}=${fn(value as Args[Keys])}`
    })
    .join("&")

  return `${url}?${query}`
}

export const drawMeBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  mode: "cors",
})
