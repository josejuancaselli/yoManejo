import { useState } from "react";
import { useFechas } from "../../helpers/useFechas";

import AgregarTurno from "./AgregarTurno";
import EditarAlumno from "./EditarAlumno";
import { IoIosClose } from "react-icons/io";
import { FaDove, FaEdit } from "react-icons/fa";



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
    borrarAlumno, capturarAlumno, alumnosFiltrados, setAlumnoSeleccionado, editarTurnoAlumno, setEditarTurnoAlumno,dataAlumno, setDataAlumno
}) => {

    
    





    return (
        <>
            
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "3px solid #54b198", paddingBottom: "10px" }}>
                <div style={{ display: "flex" }}>
                    <h3>{alumnoSeleccionado.nombre}</h3>
                </div>
                <button className="turno-btn-cerrar" style={{ marginBottom: "40px" }} onClick={() => { setDataAlumno(false) }}><IoIosClose /></button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="editar-alumno-modal">
                    <div>
                        <p>Direccion:</p>
                        <p style={{ flex: 1 }}>{alumnoSeleccionado.direccion?.["calle"]} n° {alumnoSeleccionado.direccion?.["altura"]} e/ {alumnoSeleccionado.direccion?.["entrecalles"]}</p>
                    </div>
                    <div>
                        <p>DNI: </p>
                        <p style={{ flex: 1 }}>{alumnoSeleccionado.dni}</p>
                    </div>
                    <div>
                        <p >Telefono: </p>
                        <p style={{ flex: 1 }}>{alumnoSeleccionado.telefono}</p>
                    </div>
                    <div>
                        <p>Correo: </p>
                        <p style={{ flex: 1 }}>{alumnoSeleccionado.correo}</p>
                    </div>
                    <div>
                        <p>Observaciones: </p>
                        <p style={{ height: "70px", flex: 1 }}>{alumnoSeleccionado.observaciones}</p>
                    </div>
                </div>
                <button className="turnos-btn-editar" onClick={() => setModoEdicion(true)}><FaEdit /></button>
            </div>
        </>
    )
}

export default AlumnoData


