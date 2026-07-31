import React from 'react'
import SeleccionZona from './seccionZona/SeleccionZona'
import TurnosSimulados from './seccionZona/TurnosSimulados'
import Calendario from './seccionZona/Calendario'

const ZonasSection = ({
    handleBusqueda,
    renderBusqueda,
    alumnosFiltrados,
    capturarAlumno,
    setAlumnosFiltrados,
    setRenderBusqueda,
    handleToggleZona,
    setSimulacion,
    simulacion,
    ventanaReservar,
    setVentanaReservar,
    busquedaAlumno,
    turnoSim,
    setTurnoSim,
    borrarTurnoSimulado,
    zonasSeleccionadas,
    alumnos,
    setAlumnos,
    reserva,
    setReserva,
    horariosMañana,
    horariosTarde,
    obtenerHorarios,
    horarios,
    modoSimulacion,
    setModoSimulacion,
    dataAlumno,        // 👈 nuevo
}) => {
    return (
        <div className="zonas-section">
            <div className="seleccion-zona">
                <SeleccionZona
                    handleBusqueda={handleBusqueda}
                    renderBusqueda={renderBusqueda}
                    alumnosFiltrados={alumnosFiltrados}
                    capturarAlumno={capturarAlumno}
                    setAlumnosFiltrados={setAlumnosFiltrados}
                    setRenderBusqueda={setRenderBusqueda}
                    setSimulacion={setSimulacion}
                    busquedaAlumno={busquedaAlumno}
                    modoSimulacion={modoSimulacion}
                    setModoSimulacion={setModoSimulacion}
                />

                {/* Solo mostramos TurnosSimulados si NO hay alumno abierto */}
                {turnoSim.length > 0 && !simulacion && !ventanaReservar && !dataAlumno && (
                    <TurnosSimulados
                        turnoSim={turnoSim}
                        borrarTurnoSimulado={borrarTurnoSimulado}
                    />
                )}
            </div>

            <div style={{display:"flex", marginTop:"30px"}}>
                <div className="zona-buttons-wrapper">
                    <h2>Zonas</h2>
                    <div className="zona-buttons">
                        <button className="zona-btn" onClick={() => handleToggleZona("1")}>1</button>
                        <button className="zona-btn" onClick={() => handleToggleZona("2")}>2</button>
                        <button className="zona-btn" onClick={() => handleToggleZona("3")}>3</button>
                        <button className="zona-btn" onClick={() => handleToggleZona("automatico")}>A</button>                        
                    </div>
                </div>

                <div className="zonas">
                    {zonasSeleccionadas.map((zona) => (
                        <div key={zona} className="zona-selected">
                            <Calendario
                                zona={zona}
                                turnoSim={turnoSim}
                                setTurnoSim={setTurnoSim}
                                simulacion={simulacion}
                                setSimulacion={setSimulacion}
                                alumnos={alumnos}
                                reserva={reserva}
                                setReserva={setReserva}
                                setAlumnos={setAlumnos}
                                setVentanaReservar={setVentanaReservar}
                                horariosMañana={horariosMañana}
                                horariosTarde={horariosTarde}
                                obtenerHorarios={obtenerHorarios}
                                horarios={horarios}
                            />
                        </div>
                    ))}
                </div>

            </div>


        </div>
    )
}

export default ZonasSection