import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Connexion from './pages/connexion/Connexion.jsx'
import { Toaster } from 'react-hot-toast'
import"./pages/connexion/App.css"
import motdepasseoublie from './pages/connexion/motdepasseoublie.jsx'


// creation de l'objet browserRouter

const router = createBrowserRouter([
  {
    path: '/connexion',
    element:<Connexion/>,

  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster/>
<RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
