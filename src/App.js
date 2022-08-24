import React from 'react'
import { Route } from 'react-router-dom'
import './app.css'

import Game from './Screens/Game'
import Home from './Screens/Home'

const App = () => (
  <div className="app-style">
    <Route exact path='/' component={Home} />
    <Route exact path='/game' component={Game} />
  </div>
)

export default App
