import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import AlumnoData from './AlumnoData'
import { useAlumnos } from '../../helpers/useAlumnos'
import { IoIosClose } from 'react-icons/io'
import { FaEdit } from 'react-icons/fa'
import EditarAlumno from './EditarAlumno'
import "./alumnos.css"

// ----- IMPORT CORRECTO para la versión que tenés (v2.x) -----
import { List } from "react-window"
import { Link } from 'react-router-dom'

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
    const [confirmarBorrado, setConfirmarBorrado] = useState(false)
    

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

    // -----------------------------------------------------
    // Row component: la librería v2 espera un component (rowComponent) 
    // que reciba props como { index, style, ... }.
    // Es obligatorio aplicar "style" al wrapper para que la virtualización funcione.
    // -----------------------------------------------------
    const Row = ({ index, style, ...rest }) => {
        console.log("Renderizando fila:", index) // 👈 para ver cuántas se montan realmente
        const alumno = listaAlumnos[index]
        if (!alumno) return null

        return (

            <div style={{ ...style, }}            >
                <div onClick={() => { setAlumnoSeleccionado(alumno); setDataAlumno(true) }}  className='alumnos'>
                    <h2 style={{ margin: 0 }}>{alumno.nombre}</h2>
                </div>
            </div>
        )
    }

    // -----------------------------------------------------
    // Parámetros clave:
    // - defaultHeight: alto visible del contenedor (en px)
    // - rowCount: cantidad total de filas
    // - rowHeight: alto por fila (px) — si tenés alturas dinámicas hay otra API
    // - rowComponent: el componente que renderiza cada fila (Row)
    // - rowProps: si querés pasar props adicionales a Row
    // -----------------------------------------------------

    return (
        <div className='alumnos-wrapper'>
            <div className='inicio-container'>
                <div className='nav-bar'>
                    <Link className='auto-title' to="/turnos">Ir a Turnos</Link>
                    {/* <Link className='auto-title' to="/alumnos">Alumnos</Link> */}
                    <Link className='auto-title' to="/profesores">Profesores</Link>
                </div>
            </div>
            <div style={{display:"flex", margin:"32px"}}>
                <input style={{margin:"auto"}} className="searchbar" placeholder='Buscar alumno...' type="text" value={busquedaAlumno} onChange={handleBusqueda} />
            </div>

            <div className='alumnos-content' style={{ height: '800px' }}>
                <List
                    defaultHeight={800}               // alto visible del contenedor
                    rowCount={listaAlumnos.length}    // cantidad total de filas
                    rowHeight={60}                    // alto de cada fila (ajustalo según tu CSS)
                    rowComponent={Row}                // componente que renderiza cada fila
                    rowProps={{}}                     // si necesitás pasar algo extra a Row
                    overscanCount={3}                 // filas extra renderizadas para suavizar scroll
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* La API v2 acepta children (se renderizan después) pero no hace falta aquí */}
                </List>               

                {dataAlumno && (
                    !modoEdicion ? (
                        alumnoSeleccionado && (
                            <div className='alumno-data' >
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
                                <button onClick={() => setConfirmarBorrado(true)}>Borrar</button>
                                {confirmarBorrado && (
                                    <div>
                                        <button onClick={() => setConfirmarBorrado(false)}>Cancelar</button>
                                        <button onClick={() => { borrarAlumno(alumnoSeleccionado.id); setConfirmarBorrado(false) }}>Confirmar</button>
                                    </div>
                                )}

                            </div>
                        )
                    ) : (
                        <EditarAlumno
                            alumnoSeleccionado={alumnoSeleccionado}
                            handleEditar={handleEditar}
                            editarAlumno={editarAlumno}
                            setModoEdicion={setModoEdicion}
                            modoEdicion={modoEdicion}
                        />
                    )
                )}
            </div>
        </div>
    )
}

export default Alumnos


// import { useEffect, useState } from 'react'
// import { db } from '../../firebase/firebaseConfig'
// import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
// import AlumnoData from './AlumnoData'
// import { useAlumnos } from '../../helpers/useAlumnos'
// import { IoIosClose } from 'react-icons/io'
// import { FaEdit } from 'react-icons/fa'
// import EditarAlumno from './EditarAlumno'
// import "./alumnos.css"

// const Alumnos = () => {

//     const {
//         alumnos,
//         setAlumnos,
//         alumnosFiltrados,
//         setAlumnosFiltrados,
//         ventanaAlumno,
//         setVentanaAlumno,
//         busquedaAlumno,
//         setBusquedaAlumno,
//         modoEdicion,
//         setModoEdicion,
//         alumnoSeleccionado,
//         setAlumnoSeleccionado,
//         toggleAlumno,
//         handleEditar,
//         editarAlumno,
//         handleBusquedaAlumno,
//         borrarAlumno,
//         normalizar,
//         turnoModificandose, setTurnoModificandose, todosLosTurnos, handleBusqueda, renderBusqueda, setRenderBusqueda, dataAlumno, setDataAlumno, capturarAlumno
//     } = useAlumnos()



//     const [inputAgregarTurno, setInputAgregarTurno] = useState("")
//     const [nuevoTurno, setNuevoTurno] = useState({ dia: "", mes: "", hora: "", zona: "", anio: "" })
//     const [editarTurnoAlumno, setEditarTurnoAlumno] = useState(false)
//     const [confirmarBorrado, setConfirmarBorrado] = useState(false)

//     const borrarTurnoReservado = async (dia, hora, mes, zona, anio, idAlumno) => {
//         const arrayTurnosAlumno = alumnoSeleccionado.turnos;
//         const turnoBorrado = arrayTurnosAlumno.filter((turno) => turno.dia !== dia || turno.hora !== hora || turno.mes !== mes || turno.zona !== zona || turno.anio !== anio);
//         try {
//             await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
//             alert("turno borrado con exito")
//         } catch (error) {
//             console.error("Error borrando turno:", error);
//         }
//     }

//     const agregarTurno = async (idAlumno) => {
//         const id = alumnoSeleccionado.turnos.length + 1
//         try {
//             const turnoActualizado = { ...alumnoSeleccionado, turnos: [...alumnoSeleccionado.turnos, { id, ...nuevoTurno }] }
//             // 1️⃣ Actualiza en Firebase con el nuevo objeto
//             await updateDoc(doc(db, "alumnos", idAlumno), turnoActualizado);
//             // 2️⃣ Actualiza el estado local
//             setAlumnoSeleccionado(turnoActualizado);
//             // 3️⃣ Limpia el formulario
//             setNuevoTurno({ dia: "", mes: "", hora: "", zona: "" });
//         } catch (error) {
//             console.error("Error agregando turno:", error);
//         }
//     };



//     const listaAlumnos = alumnosFiltrados.length === 0 ? alumnos : alumnosFiltrados // constante donde se elije mostrar alumnos filtrados por busqueda o a todos los alumnos

//     return (
//         <div className='alumnos-wrapper'>
//             <input className="searchbar" placeholder='Buscar alumno...' type="text" value={busquedaAlumno} onChange={handleBusqueda} />
           
            
//             <div className='alumnos-content'>
//                 {alumnosFiltrados.map((alumno, index) => {
//                     return (
//                         <div onClick={() => { setAlumnoSeleccionado(alumno); setDataAlumno(true) }} key={index} className='alumnos'>
//                             <h2 >{alumno.nombre}</h2>
//                         </div>
//                     )
//                 })}

//                 {dataAlumno && (
//                     !modoEdicion ? (
//                         alumnoSeleccionado && (
//                             <div className='alumno-data' >
//                                 <AlumnoData
//                                     setVentanaAlumno={setVentanaAlumno}
//                                     toggleAlumno={toggleAlumno}
//                                     alumnos={alumnos}
//                                     ventanaAlumno={ventanaAlumno}
//                                     modoEdicion={modoEdicion}
//                                     setModoEdicion={setModoEdicion}
//                                     alumnoSeleccionado={alumnoSeleccionado}
//                                     handleEditar={handleEditar}
//                                     editarAlumno={editarAlumno}
//                                     borrarAlumno={borrarAlumno}
//                                     borrarTurnoReservado={borrarTurnoReservado}
//                                     setAlumnoSeleccionado={setAlumnoSeleccionado}
//                                     nuevoTurno={nuevoTurno}
//                                     setNuevoTurno={setNuevoTurno}
//                                     agregarTurno={agregarTurno}
//                                     inputAgregarTurno={inputAgregarTurno}
//                                     setInputAgregarTurno={setInputAgregarTurno}
//                                     turnoModificandose={turnoModificandose}
//                                     setTurnoModificandose={setTurnoModificandose}
//                                     todosLosTurnos={todosLosTurnos}
//                                     capturarAlumno={capturarAlumno}
//                                     alumnosFiltrados={alumnosFiltrados}
//                                     editarTurnoAlumno={editarTurnoAlumno}
//                                     setEditarTurnoAlumno={setEditarTurnoAlumno}
//                                     dataAlumno={dataAlumno}
//                                     setDataAlumno={setDataAlumno}
//                                 />
//                                 <button onClick={() => setConfirmarBorrado(true)}>Borrar</button>
//                                 {confirmarBorrado && (
//                                     <div>
//                                         <button onClick={() => setConfirmarBorrado(false)}>Cancelar</button>
//                                         <button onClick={() => { borrarAlumno(alumnoSeleccionado.id), setConfirmarBorrado(false) }}>Confirmar</button>
//                                     </div>
//                                 )}

//                             </div>
//                         )
//                     ) : (
//                         <EditarAlumno
//                             alumnoSeleccionado={alumnoSeleccionado}
//                             handleEditar={handleEditar}
//                             editarAlumno={editarAlumno}
//                             setModoEdicion={setModoEdicion}
//                             modoEdicion={modoEdicion}
//                         />
//                     )
//                 )}
//             </div>



//         </div>
//     )
// }

// export default Alumnos


