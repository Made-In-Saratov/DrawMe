import { Route, Routes } from "react-router-dom"

import TabRounter from "@/pages/home/TabRouter"

export default function AppRouter() {
  return (
    <Routes>
      <Route index Component={TabRounter} />
    </Routes>
  )
}
