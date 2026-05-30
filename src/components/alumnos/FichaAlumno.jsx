import { useState } from "react"
import { IoIosClose } from "react-icons/io"
import { FaEdit } from "react-icons/fa"
import EditarAlumno from "./EditarAlumno"
import { useFechas } from "../../helpers/useFechas"

const ESCALA_COLORES = {
    "#d74545": "Necesita mejorar",
    "#ddab4f": "Regular",
    "#e7e74b": "Bien",
    "#2bcb2b": "Muy bien",
    "#f9f9f9": "Sin evaluar",
}

const ASPECTOS_EVALUACION = {
    "DOMINIO BÁSICO": ["volante", "embriague", "caja", "freno", "posicion"],
    "CIRCULACIÓN": ["carril", "velocidad", "señalizacion", "calles", "avenidas", "rotondas"],
    "ESTACIONAMIENTO": ["paraleloDerecho", "paraleloIzquierdo"],
}

const LABELS_ASPECTO = {
    volante: "Volante",
    embriague: "Embriague",
    caja: "Caja",
    freno: "Freno/Acelerador",
    posicion: "Posición de manejo",
    carril: "Carril",
    velocidad: "Velocidad",
    señalizacion: "Señalización",
    calles: "Calles",
    avenidas: "Avenidas",
    rotondas: "Rotondas",
    paraleloDerecho: "Paralelo derecho",
    paraleloIzquierdo: "Paralelo izquierdo",
}

const BadgeEvaluacion = ({ color, label }) => (
    <div className="ficha-eval-badge">
        <div
            className="ficha-eval-color"
            style={{ backgroundColor: color || "#f9f9f9" }}
        />
        <span className="ficha-eval-label">{label}</span>
        <span className="ficha-eval-escala">
            {ESCALA_COLORES[color] ?? "Sin evaluar"}
        </span>
    </div>
)

const FichaAlumno = ({
    alumnoSeleccionado,
    setDataAlumno,
    modoEdicion,
    setModoEdicion,
    handleEditar,
    editarAlumno,
    borrarAlumno,
}) => {
    const [confirmarBorrado, setConfirmarBorrado] = useState(false)
    const [mostrarEvaluacion, setMostrarEvaluacion] = useState(false)
    const { fechaDesdeDia } = useFechas()

    if (!alumnoSeleccionado) return null

    const hoy = new Date()
    const turnos = alumnoSeleccionado.turnos ?? []

    const turnosPasados = turnos
        .filter(t => new Date(t.anio, t.mes, t.dia) < hoy)
        .sort((a, b) => new Date(b.anio, b.mes, b.dia) - new Date(a.anio, a.mes, a.dia))

    const turnosFuturos = turnos
        .filter(t => new Date(t.anio, t.mes, t.dia) >= hoy)
        .sort((a, b) => new Date(a.anio, a.mes, a.dia) - new Date(b.anio, b.mes, b.dia))

    const evaluacionActual = alumnoSeleccionado.evaluacion?.actual ?? {}
    const evaluacionHistorica = alumnoSeleccionado.evaluacion?.historial ?? []

    const formatTurno = (t) =>
        `${fechaDesdeDia(t.dia, t.mes, t.anio)} ${String(t.dia).padStart(2, "0")}/${String(t.mes + 1).padStart(2, "0")}/${t.anio} — ${t.hora} hs — Coche ${t.zona}`

    return (
        <div className="ficha-alumno">
            {console.log(alumnoSeleccionado)}
            {/* ── Encabezado ── */}
            <div className="ficha-header">
                {modoEdicion ? (
                    <EditarAlumno
                        alumnoSeleccionado={alumnoSeleccionado}
                        handleEditar={handleEditar}
                        editarAlumno={editarAlumno}
                        setModoEdicion={setModoEdicion}
                        modoEdicion={modoEdicion}
                    />
                ) : (
                    <>
                        <div className="ficha-nombre-row">
                            <h2 className="ficha-nombre">{alumnoSeleccionado.nombre}</h2>
                            <div className="ficha-acciones">
                                <button
                                    className="ficha-btn-icono"
                                    onClick={() => setModoEdicion(true)}
                                    title="Editar alumno"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="ficha-btn-icono ficha-btn-cerrar"
                                    onClick={() => { setDataAlumno(false); setModoEdicion(null) }}
                                    title="Cerrar"
                                >
                                    <IoIosClose />
                                </button>
                            </div>
                        </div>

                        {/* ── Datos personales ── */}
                        <div className="ficha-seccion">
                            <h4 className="ficha-seccion-titulo">Datos personales</h4>
                            <div className="ficha-datos-grid">
                                <span className="ficha-dato-label">DNI</span>
                                <span>{alumnoSeleccionado.dni}</span>

                                <span className="ficha-dato-label">Teléfono</span>
                                <span>{alumnoSeleccionado.telefono}</span>

                                <span className="ficha-dato-label">Correo</span>
                                <span>{alumnoSeleccionado.correo}</span>

                                <span className="ficha-dato-label">Dirección</span>
                                <span>
                                    {alumnoSeleccionado.direccion?.calle}{" "}
                                    {alumnoSeleccionado.direccion?.altura
                                        ? `n° ${alumnoSeleccionado.direccion.altura}`
                                        : "s/n"}{" "}
                                    {alumnoSeleccionado.direccion?.entrecalles}
                                </span>

                                <span className="ficha-dato-label">Punto de encuentro</span>
                                <span>
                                    {alumnoSeleccionado.puntoEncuentro?.calle}{" "}
                                    {alumnoSeleccionado.puntoEncuentro?.altura
                                        ? `n° ${alumnoSeleccionado.puntoEncuentro.altura}`
                                        : "s/n"}{" "}
                                    {alumnoSeleccionado.puntoEncuentro?.entrecalles}
                                </span>

                                {alumnoSeleccionado.observaciones && (
                                    <>
                                        <span className="ficha-dato-label">Observaciones</span>
                                        <span>{alumnoSeleccionado.observaciones}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── Clases futuras ── */}
                        <div className="ficha-seccion">
                            <h4 className="ficha-seccion-titulo">
                                Próximas clases
                                <span className="ficha-badge-count">{turnosFuturos.length}</span>
                            </h4>
                            {turnosFuturos.length === 0 ? (
                                <p className="ficha-empty">Sin clases programadas</p>
                            ) : (
                                <ul className="ficha-turnos-lista">
                                    {turnosFuturos.map((t, i) => (
                                        <li key={i} className="ficha-turno-item ficha-turno-futuro">
                                            {formatTurno(t)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* ── Clases pasadas ── */}
                        <div className="ficha-seccion">
                            <h4 className="ficha-seccion-titulo">
                                Clases realizadas
                                <span className="ficha-badge-count">{turnosPasados.length}</span>
                            </h4>
                            {turnosPasados.length === 0 ? (
                                <p className="ficha-empty">Sin clases realizadas</p>
                            ) : (
                                <ul className="ficha-turnos-lista ficha-turnos-pasados">
                                    {turnosPasados.map((t, i) => (
                                        <li key={i} className="ficha-turno-item">
                                            {formatTurno(t)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* ── Última evaluación ── */}
                        <div className="ficha-seccion">
                            <button className="ficha-seccion-titulo ficha-btn-evaluacion" onClick={() => setMostrarEvaluacion(v => !v)}>
                                Última evaluación
                                <span className="ficha-chevron">{mostrarEvaluacion ? "▲" : "▼"}</span>
                            </button>

                            {mostrarEvaluacion && (
                                <div className="ficha-evaluacion">
                                    {Object.entries(ASPECTOS_EVALUACION).map(([categoria, aspectos]) => (
                                        <div key={categoria} className="ficha-eval-categoria">
                                            <h5 className="ficha-eval-categoria-titulo">{categoria}</h5>
                                            {aspectos.map(aspecto => (
                                                <BadgeEvaluacion
                                                    key={aspecto}
                                                    color={evaluacionActual[aspecto]}
                                                    label={LABELS_ASPECTO[aspecto]}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                    <div>
                                        <h5 className="ficha-eval-categoria-titulo">Anotaciones</h5>
                                        {evaluacionHistorica?.map((e, index) => {
                                            return (
                                                <div key = {index}>

                                                    <span style={{ fontWeight: "300", fontStyle: "italic", fontSize: "14px" }}>
                                                        - "{e.evaluacion.anotaciones === "" ? "sin anotaciones" : e.evaluacion.anotaciones} ({new Date(e.fecha).toLocaleDateString("es-AR")})"
                                                    </span>

                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* ── Contabilidad (futuro) ── */}
                        <div className="ficha-seccion ficha-seccion-disabled">
                            <h4 className="ficha-seccion-titulo">Contabilidad <span className="ficha-proximamente">próximamente</span></h4>
                        </div>

                        {/* ── Borrar alumno ── */}
                        <div className="ficha-seccion ficha-seccion-borrar">
                            {!confirmarBorrado ? (
                                <button
                                    className="ficha-btn-borrar"
                                    onClick={() => setConfirmarBorrado(true)}
                                >
                                    Eliminar alumno
                                </button>
                            ) : (
                                <div className="ficha-confirmar-borrado">
                                    <p>¿Confirmar eliminación de <strong>{alumnoSeleccionado.nombre}</strong>?</p>
                                    <div className="ficha-confirmar-botones">
                                        <button
                                            className="ficha-btn-cancelar"
                                            onClick={() => setConfirmarBorrado(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="ficha-btn-confirmar"
                                            onClick={() => {
                                                borrarAlumno(alumnoSeleccionado.id)
                                                setConfirmarBorrado(false)
                                                setDataAlumno(false)
                                            }}
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FichaAlumno