import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import AlumnoData from './AlumnoData'
import { useAlumnos } from '../../helpers/useAlumnos'
import { IoIosClose } from 'react-icons/io'
import { FaEdit } from 'react-icons/fa'

const Alumnos = () => {

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
        normalizar,
        turnoModificandose, setTurnoModificandose, todosLosTurnos, handleBusqueda, renderBusqueda, setRenderBusqueda, dataAlumno, setDataAlumno, capturarAlumno
    } = useAlumnos()

    const [inputAgregarTurno, setInputAgregarTurno] = useState("")
    const [nuevoTurno, setNuevoTurno] = useState({ dia: "", mes: "", hora: "", zona: "", anio: "" })
    const [editarTurnoAlumno, setEditarTurnoAlumno] = useState(false)

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



    const listaAlumnos = alumnosFiltrados.length === 0 ? alumnos : alumnosFiltrados // constante donde se elije mostrar alumnos filtrados por busqueda o a todos los alumnos

    return (
        <div>
            <input type="text" value={busquedaAlumno} onChange={handleBusqueda} />
            {listaAlumnos.map((alumno, index) => {
                return (
                    <div key={index}>
                        <h2 onClick={() => { setAlumnoSeleccionado(alumno); setDataAlumno(true) }}>{alumno.nombre}</h2>
                    </div>
                )
            })}
            
            {dataAlumno && (
                alumnoSeleccionado && (
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
                )
            )}
            {/* <div className='alumno-modal-content'>
                {listaAlumnos.map((alumno, index) => {
                    return (
                        <div key={index}>
                            <AlumnoData
                                setVentanaAlumno={setVentanaAlumno}
                                toggleAlumno={toggleAlumno}
                                alumnos={alumnos}
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
                                turnoModificandose={turnoModificandose}
                                setTurnoModificandose={setTurnoModificandose}
                                todosLosTurnos={todosLosTurnos}
                                capturarAlumno={capturarAlumno}
                                alumnosFiltrados={alumnosFiltrados}
                                editarTurnoAlumno={editarTurnoAlumno}
                                setEditarTurnoAlumno={setEditarTurnoAlumno}
                               

                            />
                        </div>

                    )
                })}
            </div> */}
        </div>
    )
}

export default Alumnos
