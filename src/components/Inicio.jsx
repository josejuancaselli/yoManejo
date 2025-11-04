import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



const Inicio = () => {

  return (
    <div className='inicio-container'>
      <div className='nav-bar'>
        <Link className='auto-title' to="/inicio">Ir a Turnos</Link>
        <Link className='auto-title' to="/alumnos">Alumnos</Link>
        <Link className='auto-title' to="/profesores">Profesores</Link>        
      </div>
    </div>
  )
}

export default Inicio