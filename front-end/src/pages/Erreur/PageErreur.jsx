import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function PageErreur() {
    const erreur = useRouteError();
  return (
    <>
    <h3>Il ya une erreur</h3>
    <p>{erreur.StatusText || erreur.message}</p>
    </>
  )
}
