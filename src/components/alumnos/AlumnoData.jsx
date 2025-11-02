import { useState } from "react";
import { useFechas } from "../../helpers/useFechas";

import AgregarTurno from "./AgregarTurno";
import EditarAlumno from "./EditarAlumno";
import { IoIosClose } from "react-icons/io";
import { FaEdit } from "react-icons/fa";



const AlumnoData = ({
    nuevoTurno,
    ventanaAlumno,
    todosLosTurnos,
    alumnos,
    turnoModificandose,
    setTurnoModificandose,
    editarAlumno,
    setNuevoTurno,
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
    setVentanaAlumno,
    borrarAlumno
}) => {

    const [dataAlumno, setDataAlumno] = useState(false)
    const { obtenerDiasDelMes, fecha, obtenerHorarios } = useFechas();





    return (
        <>

            <h2 onClick={() => { toggleAlumno(alumno), setModoEdicion(false) }}> {alumno.nombre}</h2>


            {ventanaAlumno && ventanaAlumno.id === alumno.id && (
                <div className="alumno-modal-content">
                    {!modoEdicion ? (
                        <>
                        
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "3px solid #54b198", paddingBottom: "10px" }}>
                                <div style={{ display: "flex" }}>
                                    <h3>{alumnoSeleccionado.nombre}</h3>
                                </div>
                                <button className="turno-btn-cerrar" style={{ marginBottom: "40px" }} onClick={() => { setDataAlumno(false); setVentanaAlumno(null) }}><IoIosClose /></button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className="editar-alumno-modal">
                                    <div>
                                        <p>Direccion:</p>
                                        <p>{alumnoSeleccionado.direccion}</p>
                                    </div>
                                    <div>
                                        <p>DNI: </p>
                                        <p>{alumnoSeleccionado.dni}</p>
                                    </div>
                                    <div>
                                        <p>Telefono: </p>
                                        <p>{alumnoSeleccionado.telefono}</p>
                                    </div>
                                    <div>
                                        <p>Correo: </p>
                                        <p>{alumnoSeleccionado.correo}</p>
                                    </div>
                                    <div>
                                        <p>Observaciones: </p>
                                        <p style={{ height: "70px" }}>{alumnoSeleccionado.observaciones}</p>
                                    </div>
                                </div>
                                <button className="turnos-btn-editar" onClick={() => setModoEdicion(true)}><FaEdit /></button>
                            </div>
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
                </div>
            )}
        </>
    )
}

export default AlumnoData


