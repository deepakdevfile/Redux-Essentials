import { createRoot } from 'react-dom/client'
import React from 'react'
import { Provider } from 'react-redux'

import App from './App0003'
import { worker } from './api/server'
import { store } from './app/App0003_store'

async function start(){
  await worker.start({ onUnhandledRequest: 'bypass'})
  const container = document.getElementById('root')!
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

start()