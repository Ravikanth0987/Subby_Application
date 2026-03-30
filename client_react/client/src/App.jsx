import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './suby/pages/LandingPage'
import ProductMenu from './suby/components/ProuductMenu'
import Cart from "./suby/pages/Cart";

import './App.css'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/products/:firmId/:firmName' element={<ProductMenu />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default App
