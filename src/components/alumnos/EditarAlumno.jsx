import React, { useState, useEffect } from "react";
import { useFechas } from "../../helpers/useFechas";
import AgregarTurno from "./AgregarTurno";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { FaSave } from "react-icons/fa";


const EditarAlumno = ({

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
    setEditarTurnoAlumno
}) => {


    // Estado para controlar qué turno se está editando
    const [editarTurnos, setEditarTurnos] = useState(null);



    // Estado que mantiene una copia editable de los turnos
    const [turnosEditables, setTurnosEditables] = useState([]);

    // Cargamos los turnos al entrar en modo edición o al cambiar el alumno seleccionado
    useEffect(() => {
        if (alumnoSeleccionado.turnos) {
            setTurnosEditables(alumnoSeleccionado.turnos.map((t) => ({ ...t })));
        }
    }, [alumnoSeleccionado]);


    


    return (
        <>
            {modoEdicion && (
                <>
                    {console.log(alumnoSeleccionado.id)}
                    <>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "3px solid #54b198", paddingBottom: "10px" }}>
                            <div className="editar-alumno-modal">
                                <input name="nombre" value={alumnoSeleccionado.nombre} onChange={handleEditar} />
                            </div>

                            <button className="turno-btn-cerrar" style={{ marginBottom: "40px" }} onClick={() => setModoEdicion(null)}><IoIosClose /></button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="editar-alumno-modal-1">

                                <div>
                                    <p>Dirección:</p>
                                    <input name="direccion" value={alumnoSeleccionado.direccion} onChange={handleEditar} />
                                </div>
                                <div>
                                    <p>DNI:</p>
                                    <input name="dni" value={alumnoSeleccionado.dni} onChange={handleEditar} />
                                </div>
                                <div>
                                    <p>Teléfono:</p>
                                    <input name="telefono" value={alumnoSeleccionado.telefono} onChange={handleEditar} />
                                </div>
                                <div>
                                    <p>Correo:</p>
                                    <textarea name="correo" value={alumnoSeleccionado.correo} onChange={handleEditar} />
                                </div>

                                <div>
                                    <p>Observaciones:</p>
                                    <textarea style={{height: "70px"}} name="observaciones" value={alumnoSeleccionado.observaciones} onChange={handleEditar} />
                                </div>
                            </div>
                            <button className="turnos-btn-editar" onClick={() => { editarAlumno(alumnoSeleccionado.id); setModoEdicion(false) }}><FaSave /></button>
                        </div>
                    </>
                </>
            )}       
        </>
    );
};

export default EditarAlumno;

