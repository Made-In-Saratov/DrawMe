import { Route, Routes } from "react-router-dom"

import Home from "@/pages/home/Home"
import Draw from "@/pages/draw/Draw";

export default function AppRouter() {
  return (
    <Routes>
      <Route Component={Home} /> // TODO
      <Route index Component={Draw} />
    </Routes>
  )
}
