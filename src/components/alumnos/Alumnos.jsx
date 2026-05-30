import { useMemo, useState } from 'react'
import { useAlumnos } from '../../helpers/useAlumnos'
import FichaAlumno from './FichaAlumno'
import "./alumnos.css"
import { Link } from 'react-router-dom'

const ITEMS_POR_PAGINA = 50
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
        dataAlumno,
        setDataAlumno,
    } = useAlumnos()

    const [paginaActual, setPaginaActual] = useState(0)
    const [letraActiva, setLetraActiva] = useState(null)

    const listaBase = alumnosFiltrados.length > 0 ? alumnosFiltrados : alumnos

    const listaFiltradaPorLetra = useMemo(() => {
        if (!letraActiva) return listaBase
        return listaBase.filter(alumno =>
            alumno.nombre.trim().toUpperCase().startsWith(letraActiva)
        )
    }, [listaBase, letraActiva])

    const listaOrdenada = useMemo(() => {
        return [...listaFiltradaPorLetra].sort((a, b) =>
            a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        )
    }, [listaFiltradaPorLetra])

    const inicio = paginaActual * ITEMS_POR_PAGINA
    const alumnosPagina = listaOrdenada.slice(inicio, inicio + ITEMS_POR_PAGINA)
    const totalPaginas = Math.ceil(listaOrdenada.length / ITEMS_POR_PAGINA)

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

            {/* Filtro A–Z */}
            <div className="filtro-letras">
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
                        style={{ fontWeight: letraActiva === letra ? 'bold' : 'normal' }}
                    >
                        {letra}
                    </button>
                ))}
            </div>

            <div className='alumnos-content'>

                {/* ── Lista de nombres ── */}
                <div className="alumnos-lista-col">
                    {alumnosPagina.map((alumno) => (
                        <div
                            key={alumno.id}
                            className={`alumnos ${alumnoSeleccionado?.id === alumno.id ? 'alumnos--activo' : ''}`}
                            onClick={() => {
                                setAlumnoSeleccionado(alumno)
                                setDataAlumno(true)
                                setModoEdicion(null)
                            }}
                        >
                            <h2>{alumno.nombre}</h2>
                        </div>
                    ))}

                    <div className="paginacion">
                        <button
                            disabled={paginaActual === 0}
                            onClick={() => setPaginaActual(p => p - 1)}
                        >
                            Anterior
                        </button>
                        <span>Página {paginaActual + 1} de {totalPaginas}</span>
                        <button
                            disabled={paginaActual >= totalPaginas - 1}
                            onClick={() => setPaginaActual(p => p + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {/* ── Ficha del alumno ── */}
                {dataAlumno && alumnoSeleccionado && (
                    <FichaAlumno
                        alumnoSeleccionado={alumnoSeleccionado}
                        setDataAlumno={setDataAlumno}
                        modoEdicion={modoEdicion}
                        setModoEdicion={setModoEdicion}
                        handleEditar={handleEditar}
                        editarAlumno={editarAlumno}
                        borrarAlumno={borrarAlumno}
                    />
                )}
            </div>
        </div>
    )
}

export default Alumnos