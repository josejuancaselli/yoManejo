import { useState } from "react";
import { useFechas } from "../../helpers/useFechas";

import AgregarTurno from "./AgregarTurno";
import EditarAlumno from "./EditarAlumno";



const AlumnoData = ({ nuevoTurno, ventanaAlumno, todosLosTurnos, alumnos, turnoModificandose, setTurnoModificandose, editarAlumno, setNuevoTurno, modoEdicion, setModoEdicion, alumnoSeleccionado, handleEditar, agregarTurno, alumno, borrarTurnoReservado, inputAgregarTurno, setInputAgregarTurno, toggleAlumno, borrarAlumno }) => {


    const { obtenerDiasDelMes, fecha, obtenerHorarios } = useFechas();





    return (
        <>

            <h2 onClick={() => { toggleAlumno(alumno), setModoEdicion(false) }}> {alumno.nombre} </h2>


            {ventanaAlumno && ventanaAlumno.id === alumno.id && (
                <div>
                    {!modoEdicion ? (
                        <>
                            <h3>{alumno.nombre}</h3>
                            <p>Direccion: {alumno.direccion}</p>
                            <p>DNI: {alumno.dni}</p>
                            <p>Telefono: {alumno.telefono}</p>
                            <p>Correo: {alumno.correo}</p>
                            <p>Observaciones: {alumno.observaciones}</p>
                            <h3>Turnos:</h3>
                            <ul>
                                {alumno.turnos.map((turno, index) => {
                                    return (
                                        <li key={index}>
                                            {turno.dia}/{turno.mes + 1} - {turno.hora} hs - Zona {turno.zona}
                                        </li>
                                    )
                                })}
                            </ul>
                            <button onClick={() => setModoEdicion(true)}>Editar</button>
                            <button onClick={() => borrarAlumno(alumno.id)}>Borrar alumno</button>
                        </>
                    ) : (
                        <div>
                            <EditarAlumno
                                alumnoSeleccionado={alumnoSeleccionado}
                                handleEditar={handleEditar}
                                obtenerDiasDelMes={obtenerDiasDelMes}
                                obtenerHorarios={obtenerHorarios}
                                borrarTurnoReservado={borrarTurnoReservado}
                                editarAlumno={editarAlumno}
                                alumnos={alumnos}
                                alumno={alumno}
                                setModoEdicion={setModoEdicion}
                                setInputAgregarTurno={setInputAgregarTurno}
                                turnoModificandose={turnoModificandose}
                                setTurnoModificandose={setTurnoModificandose}
                                todosLosTurnos={todosLosTurnos}

                            />
                        </div>
                    )}

                    {/*Modal para agregar turno */}
                    {inputAgregarTurno && (
                        <div>
                            <AgregarTurno
                                nuevoTurno={nuevoTurno}
                                setNuevoTurno={setNuevoTurno}
                                obtenerDiasDelMes={obtenerDiasDelMes}
                                fecha={fecha}
                                obtenerHorarios={obtenerHorarios}
                                agregarTurno={agregarTurno}
                                alumno={alumno}
                                setInputAgregarTurno={setInputAgregarTurno}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default AlumnoData


