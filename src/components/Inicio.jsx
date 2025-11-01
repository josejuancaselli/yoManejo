import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



const Inicio = () => {

  const [clave, setClave] = useState("")
  const [admin, setAdmin] = useState(false)
  const [ventanaPassword, setVentanaPassword] = useState(true)

  const password = "yomanejo"

  const handleClave = (e) => {
    setClave(e.target.value)
    if (e.target.value === password) {
      setAdmin(true)
      setVentanaPassword(false)
      localStorage.setItem("acceso", "true")
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem("acceso")
    setAdmin(false)
    setVentanaPassword(true)
    setClave("")
  }

  useEffect(() => {
    const accesoGuardado = localStorage.getItem("acceso")
    if (accesoGuardado === "true") {
      setAdmin(true)
      setVentanaPassword(false)
    }
  }, [])

  return (
    <div className='inicio-container'>
      {ventanaPassword && (
        <div className='ventana-password'>
          <input type="password"
            placeholder='Ingrese la clave de acceso'
            value={clave}
            onChange={handleClave} />
        </div>
      )}


      {admin && (
        <div className='nav-bar'>
          <Link className='auto-title' to="/inicio">Ir a Turnos</Link>
          <Link className='auto-title' to="/alumnos">Alumnos</Link>
          <Link className='auto-title' to="/profesores">Profesores</Link>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  )
}

export default Inicio