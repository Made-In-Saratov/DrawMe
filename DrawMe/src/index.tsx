import React from "react"

import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "@/styles/index.scss"

import App from "@/App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
const render = () =>
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )

render()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any

if (module.hot) {
  module.hot.accept("@/App", () => {
    // If the App module changes, re-render the updated component
    render()
  })
}
