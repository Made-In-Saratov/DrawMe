import { HelmetProvider } from "react-helmet-async"
import { Provider as ReduxProvider } from "react-redux"

import Layout from "./components/Layout"
import AppRouter from "./pages/AppRouter"
import { makeReduxStore } from "./store/store"

export default function App() {
  const store = makeReduxStore()

  return (
    <HelmetProvider>
      <ReduxProvider store={store}>
        <Layout>
          <AppRouter />
        </Layout>
      </ReduxProvider>
    </HelmetProvider>
  )
}
