import { useState, useMemo } from 'react'
import AlumnoData from './AlumnoData'
import EditarAlumno from './EditarAlumno'
import { useAlumnos } from '../../helpers/useAlumnos'
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

    // 1️⃣ lista base (búsqueda)
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

    // 3️⃣ orden alfabético
    const listaOrdenada = useMemo(() => {
        return [...listaFiltradaPorLetra].sort((a, b) =>
            a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        )
    }, [listaFiltradaPorLetra])

    // 4️⃣ paginación
    const inicio = paginaActual * ITEMS_POR_PAGINA
    const fin = inicio + ITEMS_POR_PAGINA
    const alumnosPagina = listaOrdenada.slice(inicio, fin)
    const totalPaginas = Math.ceil(listaOrdenada.length / ITEMS_POR_PAGINA)

    // reset de página al cambiar letra o búsqueda
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

            {/* BUSCADOR */}
            <div style={{ display: "flex", margin: "32px" }}>
                <input
                    className="searchbar"
                    placeholder='Buscar alumno...'
                    type="text"
                    value={busquedaAlumno}
                    onChange={(e) => {
                        handleBusqueda(e)
                        setPaginaActual(0)
                        setLetraActiva(null)
                    }}
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

            {/* LISTA */}
            <div className='alumnos-content'>
                {alumnosPagina.map(alumno => (
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

                {/* PAGINACIÓN */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    margin: "24px"
                }}>
                    <button
                        disabled={paginaActual === 0}
                        onClick={() => setPaginaActual(p => p - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {paginaActual + 1} de {totalPaginas || 1}
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
                        <AlumnoData
                            alumnoSeleccionado={alumnoSeleccionado}
                            handleEditar={handleEditar}
                            editarAlumno={editarAlumno}
                            borrarAlumno={borrarAlumno}
                            turnoModificandose={turnoModificandose}
                            setTurnoModificandose={setTurnoModificandose}
                            todosLosTurnos={todosLosTurnos}
                            capturarAlumno={capturarAlumno}
                            dataAlumno={dataAlumno}
                            setDataAlumno={setDataAlumno}
                        />
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
