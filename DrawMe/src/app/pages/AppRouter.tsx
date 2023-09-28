import { Route, Routes } from "react-router-dom"

import Draw from "@/pages/draw/Draw"
import Home from "@/pages/home/Home"

export default function AppRouter() {
  return (
    <Routes>
      <Route index Component={Home} />
      <Route path="/draw" Component={Draw} />
    </Routes>
  )
}
