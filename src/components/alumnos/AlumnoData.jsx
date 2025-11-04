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
    borrarAlumno
}) => {

    const [dataAlumno, setDataAlumno] = useState(false)
    const { obtenerDiasDelMes, fecha, obtenerHorarios } = useFechas();





    return (
        <>
            <h2 onClick={() => setDataAlumno(true)}>{alumno.nombre}</h2>
            {console.log(alumno)}
            {dataAlumno && (
                <div>
                    <h3>{alumno.nombre}</h3>
                    <p>{alumno.dni}</p>
                    <p>{alumno.direccion.calle} n° {alumno.direccion.altura} e/ {alumno.direccion.entrecalles} </p>
                    <p> {alumno.telefono} </p>
                    <p> {alumno.correo} </p>
                    <p>{alumno.observaciones}</p>
                </div>
                
            )}
            <button onClick={()=>borrarAlumno(alumno.id)}>Borrar</button>
        </>
    )
}

export default AlumnoData


