import React from 'react'
import { IoIosClose } from 'react-icons/io'

const SeleccionZona = ({ 
    busquedaAlumno,
    handleBusqueda,
    renderBusqueda,
    alumnosFiltrados,
    capturarAlumno,
    setAlumnosFiltrados,
    setRenderBusqueda,
    handleToggleZona,
    setSimulacion,    
    setModoSimulacion
}) => {

    return (
        <>
            <div className="searchbar-wrapper">
                <input className="searchbar" type="text" value={busquedaAlumno} onChange={handleBusqueda} placeholder="Buscar alumno..." />
                {renderBusqueda && (
                    <div className="alumnos-search-wrapper">
                        <ul className="alumnos-list">
                            {alumnosFiltrados.map((alumno) => (
                                <li key={alumno.id} className="alumno-item" onClick={() => { { capturarAlumno(alumno.id) } }}>
                                    {alumno.nombre}
                                </li>
                            ))}
                        </ul>
                        <button className="turno-btn-cerrar" onClick={() => { setAlumnosFiltrados([]), setRenderBusqueda(false) }}><IoIosClose /></button>
                    </div>
                )}
            </div>
            <div className="zona-buttons-wrapper">
                <h2>Zonas</h2>
                <div className="zona-buttons">
                    <button className="zona-btn" onClick={() => handleToggleZona("1")}>1</button>
                    <button className="zona-btn" onClick={() => handleToggleZona("2")}>2</button>
                    <button className="zona-btn" onClick={() => handleToggleZona("3")}>3</button>
                    <button className="zona-btn" onClick={() => handleToggleZona("automatico")}>A</button>
                    <button onClick={() => { setSimulacion(true); setModoSimulacion("preview"); }} 
                    className="zona-btn" style={{ borderRadius: "10px", backgroundColor: "#333433" }}>
                        +
                    </button>
                </div>
            </div>
        </>
    )
}

export default SeleccionZona