import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Inscription from './pages/inscription/inscription.jsx';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Bienvenue sur notre application</h1>,
  },
  {
    path: '/inscription',
    element: <Inscription />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;