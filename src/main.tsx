import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import { App } from './App0002.tsx'
import { store } from './app/App0002_store.ts'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </StrictMode>
)

