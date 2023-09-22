import { Route, Routes } from "react-router-dom"

export default function AppRouter() {
  return (
    <Routes>
      <Route index Component={() => <div>Home</div>} />
    </Routes>
  )
}
