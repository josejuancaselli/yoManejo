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

            <button onClick={() => { setSimulacion(true); setModoSimulacion("preview"); }} className="zona-btn" >
                +
            </button>

        </>
    )
}

export default SeleccionZona