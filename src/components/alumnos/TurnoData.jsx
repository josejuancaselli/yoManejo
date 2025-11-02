import React, { useState } from 'react'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import AgregarTurno from './AgregarTurno'
import { IoAdd } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

const TurnoData = ({
    ventanaAlumno,
    todosLosTurnos,
    alumnos,
    turnoModificandose,
    setTurnoModificandose,
    editarAlumno,
    setNuevoTurno,
    nuevoTurno,
    modoEdicion,
    setModoEdicion,
    alumnoSeleccionado,
    handleEditar,
    agregarTurno,
    alumno,
    borrarTurnoReservado,
    inputAgregarTurno,
    setInputAgregarTurno,
    toggleAlumno,
    borrarAlumno,
    obtenerHorarios,
    obtenerDiasDelMes,
    editarTurnoAlumno,
    setEditarTurnoAlumno,
    handleEditarTurno,
    editarTurnos,
    setEditarTurnos,
    setTurnosEditables,
    turnosEditables,
    confirmar, setConfirmar,
}) => {

    const [modalConfirmar, setModalConfirmar] = useState(false)

    return (
        <>
            <ul>
                {turnosEditables.map((turno, index) => (
                    <li key={index} className='turno-item'>
                        {editarTurnos !== index ? (
                            <div className="turno-editable">
                                <div className="turno-editable-info">
                                    <p>
                                        {String(turno.dia).padStart(2, "0")}/{String(turno.mes + 1).padStart(2, "0")} - {turno.hora} hs - Coche {turno.zona}{" "}
                                    </p>
                                    <div>

                                        <button className='turnos-btn-editar' onClick={() => setEditarTurnos(index)}>
                                            <FaEdit />
                                        </button>
                                        <button className='turnos-btn-borrar' onClick={() => setModalConfirmar(true)}>
                                            <FaRegTrashAlt />
                                        </button>
                                        {modalConfirmar && (
                                            <div>
                                                <p>¿Esta seguro que desea borrar el turno?</p>
                                                <button  onClick={() => borrarTurnoReservado(
                                                    turno.dia,
                                                    turno.hora,
                                                    turno.mes,
                                                    turno.zona,
                                                    turno.anio,
                                                    alumnoSeleccionado.id,
                                                    "si"
                                                )}>
                                                    SI
                                                </button>
                                                <button onClick={() => { setModalConfirmar(false), setConfirmar("no") }}>NO</button>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="turno-editable">
                                <div>
                                    <label>Día</label>
                                    <select className="turno-editable-select" value={turno.dia} onChange={(e) => handleEditarTurno(e, index, "dia")}>
                                        <option value="" disabled hidden></option>
                                        {obtenerDiasDelMes(turno.mes, turno.anio).map((d, i) => (
                                            <option key={i} value={d}>
                                                {String(d).padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Mes</label>
                                    <select className="turno-editable-select" value={turno.mes} onChange={(e) => handleEditarTurno(e, index, "mes")} >
                                        {[...Array(12).keys()].map((m) => (
                                            <option key={m} value={m}>
                                                {String(m + 1).padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Año</label>
                                    <select className="turno-editable-select" value={turno.anio} onChange={(e) => handleEditarTurno(e, index, "anio")} >

                                        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                        <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                    </select>

                                </div>

                                <div>
                                    <label>Hora</label>
                                    <select className="turno-editable-select" value={turno.hora} onChange={(e) => handleEditarTurno(e, index, "hora")} >
                                        {obtenerHorarios().map((h, i) => (
                                            <option key={i} value={h}>
                                                {h}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Coche</label>
                                    <select className="turno-editable-select" value={turno.zona} onChange={(e) => handleEditarTurno(e, index, "zona")} >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="automatico">Atm</option>
                                    </select>
                                </div>

                                <button className='turno-btn-cerrar' onClick={() => setEditarTurnos(null)}><IoIosClose /></button> {/* cerrar el turno */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button className='turno-btn-agregar' onClick={() => setInputAgregarTurno(true)}> <IoAdd /> </button>

            {inputAgregarTurno && (
                <div className='turno-item'>
                    <AgregarTurno
                        inputAgregarTurno={inputAgregarTurno}
                        setInputAgregarTurno={setInputAgregarTurno}
                        agregarTurno={agregarTurno}
                        alumnoSeleccionado={alumnoSeleccionado}
                        setNuevoTurno={setNuevoTurno}
                        nuevoTurno={nuevoTurno}
                        obtenerDiasDelMes={obtenerDiasDelMes}
                        obtenerHorarios={obtenerHorarios}
                    />
                </div>
            )}
        </>
    )
}

export default TurnoData