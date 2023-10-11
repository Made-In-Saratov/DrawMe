import { Route, Routes } from "react-router-dom"

import TabRouter from "@/pages/home/TabRouter"

export default function AppRouter() {
  return (
    <Routes>
      <Route index Component={TabRouter} />
    </Routes>
  )
}
