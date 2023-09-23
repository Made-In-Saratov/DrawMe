import { Route, Routes } from "react-router-dom"

import Home from "@/pages/home/Home"

export default function AppRouter() {
  return (
    <Routes>
      <Route index Component={Home} />
    </Routes>
  )
}
