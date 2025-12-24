import { useEffect, useState, useMemo } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import AlumnoData from './AlumnoData'
import { useAlumnos } from '../../helpers/useAlumnos'
import EditarAlumno from './EditarAlumno'
import "./alumnos.css"
import { Link } from 'react-router-dom'

const ITEMS_POR_PAGINA = 100
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const Alumnos = () => {

    const {
        alumnos,
        alumnosFiltrados,
        busquedaAlumno,
        modoEdicion,
        setModoEdicion,
        alumnoSeleccionado,
        setAlumnoSeleccionado,
        handleEditar,
        editarAlumno,
        handleBusqueda,
        borrarAlumno,
        turnoModificandose,
        setTurnoModificandose,
        todosLosTurnos,
        dataAlumno,
        setDataAlumno,
        capturarAlumno
    } = useAlumnos()

    const [paginaActual, setPaginaActual] = useState(0)
    const [letraActiva, setLetraActiva] = useState(null)
    const [inputAgregarTurno, setInputAgregarTurno] = useState("")
    const [nuevoTurno, setNuevoTurno] = useState({ dia: "", mes: "", hora: "", zona: "", anio: "" })
    const [editarTurnoAlumno, setEditarTurnoAlumno] = useState(false)
    const [confirmarBorrado, setConfirmarBorrado] = useState(false)

    // 1️⃣ Elegimos lista base
    const listaBase = alumnosFiltrados.length > 0 ? alumnosFiltrados : alumnos

    // 2️⃣ filtro por letra
    const listaFiltradaPorLetra = useMemo(() => {
        if (!letraActiva) return listaBase

        return listaBase.filter(alumno =>
            alumno.nombre
                .trim()
                .toUpperCase()
                .startsWith(letraActiva)
        )
    }, [listaBase, letraActiva])

    // 2️⃣ ORDEN ALFABÉTICO (solo se recalcula si cambia la lista)
    const listaOrdenada = useMemo(() => {
        return [...listaFiltradaPorLetra].sort((a, b) =>
            a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        )
    }, [listaFiltradaPorLetra])

    // 3️⃣ Paginación
    const inicio = paginaActual * ITEMS_POR_PAGINA
    const fin = inicio + ITEMS_POR_PAGINA
    const alumnosPagina = listaOrdenada.slice(inicio, fin)
    const totalPaginas = Math.ceil(listaOrdenada.length / ITEMS_POR_PAGINA)

    const borrarTurnoReservado = async (dia, hora, mes, zona, anio, idAlumno) => {
        const turnoBorrado = alumnoSeleccionado.turnos.filter(
            (turno) =>
                turno.dia !== dia ||
                turno.hora !== hora ||
                turno.mes !== mes ||
                turno.zona !== zona ||
                turno.anio !== anio
        )

        try {
            await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
            alert("turno borrado con éxito")
        } catch (error) {
            console.error(error)
        }
    }

    const agregarTurno = async (idAlumno) => {
        const id = alumnoSeleccionado.turnos.length + 1
        try {
            const turnoActualizado = {
                ...alumnoSeleccionado,
                turnos: [...alumnoSeleccionado.turnos, { id, ...nuevoTurno }]
            }

            await updateDoc(doc(db, "alumnos", idAlumno), turnoActualizado)
            setAlumnoSeleccionado(turnoActualizado)
            setNuevoTurno({ dia: "", mes: "", hora: "", zona: "" })
        } catch (error) {
            console.error(error)
        }
    }

    const seleccionarLetra = (letra) => {
        setLetraActiva(letra)
        setPaginaActual(0)
    }


    return (
        <div className='alumnos-wrapper'>

            <div className='inicio-container'>
                <div className='nav-bar'>
                    <Link className='auto-title' to="/turnos">Ir a Turnos</Link>
                    <Link className='auto-title' to="/profesores">Profesores</Link>
                </div>
            </div>

            <div style={{ display: "flex", margin: "32px" }}>
                <input
                    style={{ margin: "auto" }}
                    className="searchbar"
                    placeholder='Buscar alumno...'
                    type="text"
                    value={busquedaAlumno}
                    onChange={handleBusqueda}
                />
            </div>

            {/* FILTRO A–Z */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                justifyContent: "center",
                marginBottom: "24px"
            }}>
                <button
                    onClick={() => seleccionarLetra(null)}
                    style={{ fontWeight: !letraActiva ? 'bold' : 'normal' }}
                >
                    Todas
                </button>

                {LETRAS.map(letra => (
                    <button
                        key={letra}
                        onClick={() => seleccionarLetra(letra)}
                        style={{
                            fontWeight: letraActiva === letra ? 'bold' : 'normal'
                        }}
                    >
                        {letra}
                    </button>
                ))}
            </div>

            <div className='alumnos-content'>

                {alumnosPagina.map((alumno) => (
                    <div
                        key={alumno.id}
                        className='alumnos'
                        onClick={() => {
                            setAlumnoSeleccionado(alumno)
                            setDataAlumno(true)
                        }}
                    >
                        <h2>{alumno.nombre}</h2>
                    </div>
                ))}

                {/* CONTROLES DE PAGINACIÓN */}
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", margin: "24px" }}>
                    <button
                        disabled={paginaActual === 0}
                        onClick={() => setPaginaActual(p => p - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {paginaActual + 1} de {totalPaginas}
                    </span>

                    <button
                        disabled={paginaActual >= totalPaginas - 1}
                        onClick={() => setPaginaActual(p => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>

                {dataAlumno && (
                    !modoEdicion ? (
                        alumnoSeleccionado && (
                            <div className='alumno-data'>
                                <AlumnoData
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
                                    editarTurnoAlumno={editarTurnoAlumno}
                                    setEditarTurnoAlumno={setEditarTurnoAlumno}
                                    dataAlumno={dataAlumno}
                                    setDataAlumno={setDataAlumno}
                                />

                                <button onClick={() => setConfirmarBorrado(true)}>Borrar</button>

                                {confirmarBorrado && (
                                    <div>
                                        <button onClick={() => setConfirmarBorrado(false)}>Cancelar</button>
                                        <button onClick={() => {
                                            borrarAlumno(alumnoSeleccionado.id)
                                            setConfirmarBorrado(false)
                                        }}>
                                            Confirmar
                                        </button>
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

