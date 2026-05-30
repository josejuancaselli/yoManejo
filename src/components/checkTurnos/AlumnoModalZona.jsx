import React from 'react'
import EditarAlumno from '../alumnos/EditarAlumno'
import AlumnoData from '../alumnos/AlumnoData'
import TurnoData from '../alumnos/TurnoData'
import { IoAdd } from 'react-icons/io5'

const AlumnoModalZona = ({
    modoEdicion,
    setModoEdicion,
    alumnoSeleccionado,
    handleEditar,
    editarAlumno,
    borrarTurnoReservado,
    agregarTurno,
    editarTurnos,
    setEditarTurnos,
    setDataAlumno,
    obtenerDiasDelMes,
    obtenerHorarios,
    handleEditarTurno,
    turnosEditables,
    setTurnosEditables,
    setSimulacion,
    setTurnoSim,
    setModoSimulacion,
    turnoSim,               // 👈 nuevo
    borrarTurnoSimulado,    // 👈 nuevo
}) => {

    if (!alumnoSeleccionado) return null

    const handleImprimir = () => {
        setSimulacion(true)
        setModoSimulacion("readonly")
        if (!modoEdicion) {
            setTurnoSim([alumnoSeleccionado.turnos])
        }
    }

    return (
        <div className="alumno-modal-content">

            {/* Encabezado: vista de datos o formulario de edición */}
            {modoEdicion ? (
                <EditarAlumno
                    alumnoSeleccionado={alumnoSeleccionado}
                    handleEditar={handleEditar}
                    obtenerDiasDelMes={obtenerDiasDelMes}
                    obtenerHorarios={obtenerHorarios}
                    borrarTurnoReservado={borrarTurnoReservado}
                    editarAlumno={editarAlumno}
                    setModoEdicion={setModoEdicion}
                    modoEdicion={modoEdicion}
                />
            ) : (
                <AlumnoData
                    setModoEdicion={setModoEdicion}
                    alumnoSeleccionado={alumnoSeleccionado}
                    setDataAlumno={setDataAlumno}
                />
            )}

            {/* Turnos confirmados + pendientes */}
            <div className="turnos-editables">
                <h3>Turnos:</h3>
                <TurnoData
                    alumnoSeleccionado={alumnoSeleccionado}
                    handleEditar={handleEditar}
                    obtenerDiasDelMes={obtenerDiasDelMes}
                    obtenerHorarios={obtenerHorarios}
                    borrarTurnoReservado={borrarTurnoReservado}
                    editarAlumno={editarAlumno}
                    setModoEdicion={setModoEdicion}
                    modoEdicion={modoEdicion}
                    handleEditarTurno={handleEditarTurno}
                    turnosEditables={turnosEditables}
                    setTurnosEditables={setTurnosEditables}
                    editarTurnos={editarTurnos}
                    setEditarTurnos={setEditarTurnos}
                    turnoSim={turnoSim}                         // 👈 nuevo
                    borrarTurnoSimulado={borrarTurnoSimulado}   // 👈 nuevo
                />
            </div>

            {/* Botones */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                    className="btn-guardar"
                    onClick={() => { editarAlumno(alumnoSeleccionado.id); setDataAlumno(false); setEditarTurnos(null) }}
                >
                    Guardar cambios
                </button>
                <button
                    className="btn-guardar"
                    onClick={() => agregarTurno(alumnoSeleccionado.id)}
                    disabled={turnoSim.length === 0}
                    title={turnoSim.length === 0 ? "Seleccioná turnos en el calendario primero" : `Confirmar ${turnoSim.length} turno/s`}
                >
                    <IoAdd />
                </button>
                <button
                    className="btn-cerrar"
                    onClick={handleImprimir}
                >
                    Imprimir
                </button>
            </div>

        </div>
    )
}

export default AlumnoModalZona