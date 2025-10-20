import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import AlumnoData from './AlumnoData'
import { useAlumnos } from '../../helpers/useAlumnos'

const Alumnos = () => {
    const [dataAlumno, setDataAlumno] = useState(false)
    const [renderBusqueda, setRenderBusqueda] = useState(false)
    const {
        alumnos,
        setAlumnos,
        alumnosFiltrados,
        setAlumnosFiltrados,
        ventanaAlumno,
        setVentanaAlumno,
        busquedaAlumno,
        setBusquedaAlumno,
        modoEdicion,
        setModoEdicion,
        alumnoSeleccionado,
        setAlumnoSeleccionado,
        toggleAlumno,
        handleEditar,
        editarAlumno,
        handleBusquedaAlumno,
        borrarAlumno,
        normalizar } = useAlumnos()

    const [inputAgregarTurno, setInputAgregarTurno] = useState("")
    const [nuevoTurno, setNuevoTurno] = useState({ dia: "", mes: "", hora: "", zona: "", anio: "" })

    const borrarTurnoReservado = async (dia, hora, mes, zona, anio, idAlumno) => {
        const arrayTurnosAlumno = alumnoSeleccionado.turnos;
        const turnoBorrado = arrayTurnosAlumno.filter((turno) => turno.dia !== dia || turno.hora !== hora || turno.mes !== mes || turno.zona !== zona || turno.anio !== anio);
        try {
            await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
            alert("turno borrado con exito")
        } catch (error) {
            console.error("Error borrando turno:", error);
        }
    }

    const agregarTurno = async (idAlumno) => {
        const id = alumnoSeleccionado.turnos.length + 1
        try {
            const turnoActualizado = { ...alumnoSeleccionado, turnos: [...alumnoSeleccionado.turnos, { id, ...nuevoTurno }] }
            // 1️⃣ Actualiza en Firebase con el nuevo objeto
            await updateDoc(doc(db, "alumnos", idAlumno), turnoActualizado);
            // 2️⃣ Actualiza el estado local
            setAlumnoSeleccionado(turnoActualizado);
            // 3️⃣ Limpia el formulario
            setNuevoTurno({ dia: "", mes: "", hora: "", zona: "" });
        } catch (error) {
            console.error("Error agregando turno:", error);
        }
    };

    const handleBusqueda = (e) => {
        const value = e.target.value.toLowerCase();
        setBusquedaAlumno(value);
        if (value === "") {
            // Si el input está vacío, dejamos el array vacío
            setAlumnosFiltrados([]);

            return;
        }
        // Filtramos los alumnos
        const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(value));
        setAlumnosFiltrados(filtrados);
    };

    const listaAlumnos = alumnosFiltrados.length === 0 ? alumnos : alumnosFiltrados // constante donde se elije mostrar alumnos filtrados por busqueda o a todos los alumnos

    return (
        <div>
            <input type="text" value={busquedaAlumno} onChange={handleBusqueda} />
            <div>
                {listaAlumnos.map((alumno, index) => {
                    return (
                        <div key={index}>
                            <AlumnoData
                                toggleAlumno={toggleAlumno}
                                alumno={alumno}
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
                            />
                        </div>

                    )
                })}
            </div>
        </div>
    )
}

export default Alumnos
