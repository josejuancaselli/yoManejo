import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'



const Inicio = () => {

  // Inicializamos AOS

  return (
    <div >
      <Link className='auto-title' to="/turnos">Ir a Turnos</Link>
    </div>
  )
}

export default Inicio