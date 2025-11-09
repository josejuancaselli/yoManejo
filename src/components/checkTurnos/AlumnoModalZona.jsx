import React from 'react'
import EditarAlumno from '../alumnos/EditarAlumno';
import AlumnoData from '../alumnos/AlumnoData';
import TurnoData from '../alumnos/TurnoData';
import { IoAdd } from 'react-icons/io5';

const AlumnoModalZona = ({
    setVentanaAlumno,
    toggleAlumno,
    alumnos,
    ventanaAlumno,
    modoEdicion,
    setModoEdicion,
    alumnoSeleccionado,
    handleEditar,
    editarAlumno,
    borrarAlumno,
    borrarTurnoReservado,
    setAlumnoSeleccionado,
    nuevoTurno,
    setNuevoTurno,
    agregarTurno,
    inputAgregarTurno,
    setInputAgregarTurno,
    turnoModificandose,
    setTurnoModificandose,
    todosLosTurnos,
    capturarAlumno,
    alumnosFiltrados,    
    editarTurnoAlumno,
    setEditarTurnoAlumno,
    editarTurnos,
    setEditarTurnos,
    dataAlumno,
    setDataAlumno,
    obtenerDiasDelMes,
    obtenerHorarios,
    handleEditarTurno,
    turnosEditables,
    setTurnosEditables,
    setSimulacion,
    setTurnoSim,
    setWarningReserva,
}) => {


    return (
        <>
            {!modoEdicion ? (
                alumnoSeleccionado && (
                    <div className="alumno-modal-content">
                        <AlumnoData
                            setVentanaAlumno={setVentanaAlumno}
                            toggleAlumno={toggleAlumno}
                            alumnos={alumnos}
                            ventanaAlumno={ventanaAlumno}
                            modoEdicion={modoEdicion}
                            setModoEdicion={setModoEdicion}
                            alumnoSeleccionado={alumnoSeleccionado}
                            handleEditar={handleEditar}
                            editarAlumno={editarAlumno}
                            borrarAlumno={borrarAlumno}
                            borrarTurnoReservado={borrarTurnoReservado}
                            setAlumnoSeleccionado={setAlumnoSeleccionado}
                            nuevoTurno={nuevoTurno}
                            setNuevoTurno={setNuevoTurno}
                            agregarTurno={agregarTurno}
                            inputAgregarTurno={inputAgregarTurno}
                            setInputAgregarTurno={setInputAgregarTurno}
                            turnoModificandose={turnoModificandose}
                            setTurnoModificandose={setTurnoModificandose}
                            todosLosTurnos={todosLosTurnos}
                            capturarAlumno={capturarAlumno}
                            alumnosFiltrados={alumnosFiltrados}
                            editarTurnoAlumno={editarTurnoAlumno}
                            setEditarTurnoAlumno={setEditarTurnoAlumno}
                            dataAlumno={dataAlumno}
                            setDataAlumno={setDataAlumno}
                        />

                        <div className="turnos-editables">
                            <h3>Turnos:</h3>
                            <TurnoData
                                nuevoTurno={nuevoTurno}
                                setNuevoTurno={setNuevoTurno}
                                alumnoSeleccionado={alumnoSeleccionado}
                                handleEditar={handleEditar}
                                obtenerDiasDelMes={obtenerDiasDelMes}
                                obtenerHorarios={obtenerHorarios}
                                borrarTurnoReservado={borrarTurnoReservado}
                                editarAlumno={editarAlumno}
                                setModoEdicion={setModoEdicion}
                                modoEdicion={modoEdicion}
                                setInputAgregarTurno={setInputAgregarTurno}
                                inputAgregarTurno={inputAgregarTurno}
                                agregarTurno={agregarTurno}
                                editarTurnoAlumno={editarTurnoAlumno}
                                setEditarTurnoAlumno={setEditarTurnoAlumno}
                                handleEditarTurno={handleEditarTurno}
                                turnosEditables={turnosEditables}
                                setTurnosEditables={setTurnosEditables}
                                editarTurnos={editarTurnos}
                                setEditarTurnos={setEditarTurnos}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn-guardar" onClick={() => { editarAlumno(alumnoSeleccionado.id); setDataAlumno(false); setEditarTurnos(null) }}>Guardar cambios</button>
                            <button className="btn-guardar" onClick={()=>agregarTurno(alumnoSeleccionado.id)}><IoAdd /></button>
                            {console.log(alumnoSeleccionado)}
                            <button className="btn-cerrar" onClick={() => { setSimulacion(true); setTurnoSim([alumnoSeleccionado.turnos]); setWarningReserva(false) }}>Imprimir</button>
                        </div>
                    </div>
                )
            ) : (
                alumnoSeleccionado && (
                    <div className="alumno-modal-content">
                        <EditarAlumno
                            nuevoTurno={nuevoTurno}
                            setNuevoTurno={setNuevoTurno}
                            alumnoSeleccionado={alumnoSeleccionado}
                            handleEditar={handleEditar}
                            obtenerDiasDelMes={obtenerDiasDelMes}
                            obtenerHorarios={obtenerHorarios}
                            borrarTurnoReservado={borrarTurnoReservado}
                            editarAlumno={editarAlumno}
                            setModoEdicion={setModoEdicion}
                            modoEdicion={modoEdicion}
                            setInputAgregarTurno={setInputAgregarTurno}
                            inputAgregarTurno={inputAgregarTurno}
                            agregarTurno={agregarTurno}
                            editarTurnoAlumno={editarTurnoAlumno}
                            setEditarTurnoAlumno={setEditarTurnoAlumno}
                        />

                        <div className="turnos-editables">
                            <h3>Turnos:</h3>
                            <TurnoData
                                nuevoTurno={nuevoTurno}
                                setNuevoTurno={setNuevoTurno}
                                alumnoSeleccionado={alumnoSeleccionado}
                                handleEditar={handleEditar}
                                obtenerDiasDelMes={obtenerDiasDelMes}
                                obtenerHorarios={obtenerHorarios}
                                borrarTurnoReservado={borrarTurnoReservado}
                                editarAlumno={editarAlumno}
                                setModoEdicion={setModoEdicion}
                                modoEdicion={modoEdicion}
                                setInputAgregarTurno={setInputAgregarTurno}
                                inputAgregarTurno={inputAgregarTurno}
                                agregarTurno={agregarTurno}
                                editarTurnoAlumno={editarTurnoAlumno}
                                setEditarTurnoAlumno={setEditarTurnoAlumno}
                                handleEditarTurno={handleEditarTurno}
                                turnosEditables={turnosEditables}
                                setTurnosEditables={setTurnosEditables}
                                editarTurnos={editarTurnos}
                                setEditarTurnos={setEditarTurnos}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn-guardar" onClick={() => { editarAlumno(alumnoSeleccionado.id); setDataAlumno(false) }}>Guardar cambios</button>
                            <button className="btn-guardar" onClick={()=>agregarTurno(alumnoSeleccionado.id)}>Agregar</button>
                            <button className="btn-cerrar" onClick={() => { setSimulacion(true) }}>Imprimir</button>
                        </div>
                    </div>
                )
            )}

        </>
    )
}

export default AlumnoModalZona