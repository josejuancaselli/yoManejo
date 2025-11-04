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
    toggleZona,
    setSimulacion,
    simulacion,
    ventanaReservar,
    setVentanaReservar,
    setWarningReserva,
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
    setBotonReserva
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
                    toggleZona={toggleZona}
                    setSimulacion={setSimulacion}
                    setWarningReserva={setWarningReserva}
                    busquedaAlumno={busquedaAlumno}
                    setBotonReserva={setBotonReserva}
                />

                {turnoSim.length > 0 && !simulacion && !ventanaReservar && (
                    <TurnosSimulados
                        turnoSim={turnoSim}
                        borrarTurnoSimulado={borrarTurnoSimulado}
                    />
                )}
            </div>

            <div className="zonas">
                {zonasSeleccionadas.map((zona) => (
                    <div key={zona} className="zona-selected">
                        <Calendario
                            zona={zona} // 👈 se pasa la zona específica
                            turnoSim={turnoSim}
                            setTurnoSim={setTurnoSim}
                            simulacion={simulacion}
                            setSimulacion={setSimulacion}
                            alumnos={alumnos}
                            reserva={reserva}
                            setReserva={setReserva}
                            setAlumnos={setAlumnos}
                            ventanaReservar={ventanaReservar}
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
    )
}

export default ZonasSection