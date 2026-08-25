import type {JSX} from 'react'
import {Counter} from './components/Counter'

export const App = (): JSX.Element => (
  <div className='App'>
    <header className='App-header'>
      <Counter />
    </header>
  </div>
)