import html2canvas from "html2canvas"
import { useState } from "react"
import { useFechas } from "../../helpers/useFechas"
import { usePaquetes, getPrecio } from "../../helpers/usePaquetes"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const MEDIOS_PAGO = ["efectivo", "transferencia", "credito"]
const RECARGO_CREDITO = 0.35

const Simulacion = ({
    setSimulacion,
    setTurnoSim,
    turnoSim,
    setVentanaReservar,
    modoSimulacion,
    alumnos,
    agregarTurno,
    setAlumnoSeleccionado,
    setDataAlumno,
}) => {
    const { fechaDesdeDia } = useFechas()
    const { paquetes, cargando } = usePaquetes()

    const [pantalla, setPantalla] = useState("lista")
    const [busqueda, setBusqueda] = useState("")
    const [alumnoElegido, setAlumnoElegido] = useState(null)

    // Pago alumno existente
    const [tipoAuto, setTipoAuto] = useState("manual")
    const [carrito, setCarrito] = useState([])
    const [medioPago, setMedioPago] = useState("efectivo")

    const isPreview = modoSimulacion === "preview"
    const isReadonly = modoSimulacion === "readonly"

    const conRecargo = medioPago === "credito"
    const totalBase = carrito.reduce((acc, item) => acc + item.precioCalculado, 0)
    const totalFinal = conRecargo ? Math.round(totalBase * (1 + RECARGO_CREDITO)) : totalBase

    const paquetesFiltrados = paquetes.filter(p =>
        tipoAuto === "manual" ? true : !p.soloManual
    )

    const contarPaq = (id) => carrito.filter(i => i.id === id).length

    const agregarPaq = (paq) => {
        const precioCalculado = getPrecio(paq, tipoAuto, true)
        setCarrito(prev => [...prev, { ...paq, precioCalculado }])
    }

    const quitarItem = (index) => {
        setCarrito(prev => prev.filter((_, i) => i !== index))
    }

    const handleTipoAuto = (tipo) => {
        setTipoAuto(tipo)
        setCarrito(prev => prev
            .filter(p => tipo === "automatico" ? !p.soloManual : true)
            .map(p => ({ ...p, precioCalculado: getPrecio(p, tipo, true) }))
        )
    }

    const imprimirJPG = () => {
        const element = document.querySelector(".simulacion-list")
        if (!element) return
        const backdrop = document.querySelector(".simulacion-modal-backdrop")
        const originalBackdropDisplay = backdrop?.style.display
        if (backdrop) backdrop.style.display = "hidden"
        html2canvas(element, { backgroundColor: "#ffffffff" })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg", 1.0)
                const link = document.createElement("a")
                link.href = imgData
                link.download = "turnos.jpeg"
                link.click()
            })
            .finally(() => {
                if (backdrop && originalBackdropDisplay !== undefined) {
                    backdrop.style.display = originalBackdropDisplay
                }
            })
    }

    const handleImprimir = () => {
        if (turnoSim.length === 0) {
            alert("No hay turnos para simular")
            setSimulacion(false)
            return
        }
        imprimirJPG()
    }

    const normalizar = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

    const alumnosFiltrados = busqueda.length > 0
        ? alumnos.filter(a => normalizar(a.nombre).includes(normalizar(busqueda)))
        : []

    const handleConfirmarAlumnoExistente = async () => {
        if (!alumnoElegido) return

        // Agregar turnos
        await agregarTurno(alumnoElegido.id)

        // Registrar pagos si hay carrito
        if (carrito.length > 0) {
            await Promise.all(carrito.map(item => {
                const precioFinal = conRecargo
                    ? Math.round(item.precioCalculado * (1 + RECARGO_CREDITO))
                    : item.precioCalculado

                return addDoc(collection(db, "pagos"), {
                    idAlumno: alumnoElegido.id,
                    nombreAlumno: alumnoElegido.nombre,
                    fecha: Timestamp.now(),
                    tipo: item.esExamen ? "examen" : "paquete",
                    paquete: item.esExamen ? null : item.id,
                    cantidadClases: item.clases,
                    monto: precioFinal,
                    montoBase: item.precioCalculado,
                    medioPago,
                    tipoAuto,
                    esAlumno: item.esExamen ? true : null,
                    recargoAplicado: conRecargo,
                })
            }))
        }

        setAlumnoSeleccionado(alumnoElegido)
        setDataAlumno(true)
        setSimulacion(false)
    }

    const cerrar = () => {
        setSimulacion(false)
        setTurnoSim([])
        setPantalla("lista")
        setBusqueda("")
        setAlumnoElegido(null)
        setCarrito([])
    }

    return (
        <div className="simulacion-modal-backdrop">
            <div className="simulacion-modal">
                <button onClick={cerrar} className="btn-close" aria-label="Cerrar">×</button>

                {/* ── Lista de turnos ── */}
                {pantalla === "lista" && (
                    <>
                        <ul className="simulacion-list">
                            {[...turnoSim.flat()]
                                .sort((a, b) => {
                                    const fechaA = new Date(a.anio, a.mes, a.dia, parseInt(a.hora))
                                    const fechaB = new Date(b.anio, b.mes, b.dia, parseInt(b.hora))
                                    return fechaA - fechaB
                                })
                                .map((e, index) => (
                                    <li key={index} className="simulacion-item" style={{ color: "#377363" }}>
                                        {fechaDesdeDia(e.dia, e.mes, e.anio)} - {String(e.dia).padStart(2, "0")}/{String(e.mes + 1).padStart(2, "0")}/{e.anio} - {e.hora} hs - Coche {e.zona}
                                    </li>
                                ))}
                            {isPreview && <div>NO VALIDO COMO RESERVA</div>}
                        </ul>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <button className="btn-imprimir" onClick={handleImprimir}>
                                {isReadonly ? "Imprimir" : "Simular"}
                            </button>
                            {isPreview && (
                                <button className="btn-imprimir" onClick={() => setPantalla("validacion")}>
                                    Reservar
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* ── Validación ── */}
                {pantalla === "validacion" && (
                    <div className="sim-validacion">
                        <p className="sim-validacion-titulo">¿El alumno ya existe?</p>
                        <p className="sim-validacion-sub">Seleccioná si el alumno ya está registrado o si es nuevo.</p>
                        <div className="sim-validacion-botones">
                            <button className="sim-btn-opcion" onClick={() => setPantalla("buscar")}>
                                <span className="sim-btn-icono">🔍</span>
                                <span className="sim-btn-label">Sí, buscar alumno</span>
                            </button>
                            <button className="sim-btn-opcion" onClick={() => { setVentanaReservar(true); setSimulacion(false) }}>
                                <span className="sim-btn-icono">✚</span>
                                <span className="sim-btn-label">No, crear alumno nuevo</span>
                            </button>
                        </div>
                        <button className="sim-btn-volver" onClick={() => setPantalla("lista")}>← Volver</button>
                    </div>
                )}

                {/* ── Buscador ── */}
                {pantalla === "buscar" && (
                    <div className="sim-buscar">
                        <p className="sim-validacion-titulo">Buscar alumno</p>
                        <input
                            className="sim-search"
                            type="text"
                            placeholder="Nombre del alumno..."
                            value={busqueda}
                            onChange={e => { setBusqueda(e.target.value); setAlumnoElegido(null) }}
                            autoFocus
                        />
                        {alumnosFiltrados.length > 0 && (
                            <ul className="sim-resultados">
                                {alumnosFiltrados.map(alumno => (
                                    <li
                                        key={alumno.id}
                                        className={`sim-resultado-item ${alumnoElegido?.id === alumno.id ? "sim-resultado-item--activo" : ""}`}
                                        onClick={() => { setAlumnoElegido(alumno); setPantalla("pago") }}
                                    >
                                        {alumno.nombre}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {busqueda.length > 0 && alumnosFiltrados.length === 0 && (
                            <p className="sim-no-resultados">Sin resultados</p>
                        )}
                        <button className="sim-btn-volver" onClick={() => { setPantalla("validacion"); setBusqueda(""); setAlumnoElegido(null) }}>
                            ← Volver
                        </button>
                    </div>
                )}

                {/* ── Pago alumno existente ── */}
                {pantalla === "pago" && !cargando && (
                    <div className="sim-pago">
                        <p className="sim-validacion-titulo">Registrar pago — {alumnoElegido?.nombre}</p>

                        {/* Tipo de auto */}
                        <div>
                            <p className="sim-pago-label">Tipo de auto</p>
                            <div className="sim-tipo-auto-grid">
                                {["manual", "automatico"].map(tipo => (
                                    <div
                                        key={tipo}
                                        className={`sim-medio-btn ${tipoAuto === tipo ? "sim-medio-btn--activo" : ""}`}
                                        onClick={() => handleTipoAuto(tipo)}
                                    >
                                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Paquetes */}
                        <div>
                            <p className="sim-pago-label">Paquetes</p>
                            <div className="sim-paq-grid">
                                {paquetesFiltrados.map(paq => {
                                    const count = contarPaq(paq.id)
                                    const precio = getPrecio(paq, tipoAuto, true)
                                    return (
                                        <div
                                            key={paq.id}
                                            className={`sim-paq-btn ${count > 0 ? "sim-paq-btn--activo" : ""} ${paq.esExamen ? "sim-paq-btn--examen" : ""}`}
                                            onClick={() => agregarPaq(paq)}
                                        >
                                            {count > 0 && <span className="sim-paq-badge">{count}</span>}
                                            <span className="sim-paq-nombre">{paq.label}</span>
                                            {paq.clases > 0 && (
                                                <span className="sim-paq-clases">{paq.clases} clase{paq.clases > 1 ? "s" : ""}</span>
                                            )}
                                            <span className="sim-paq-precio">${precio.toLocaleString("es-AR")}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Medio de pago */}
                        <div>
                            <p className="sim-pago-label">Medio de pago</p>
                            <div className="sim-medio-grid">
                                {MEDIOS_PAGO.map(medio => (
                                    <div
                                        key={medio}
                                        className={`sim-medio-btn ${medioPago === medio ? "sim-medio-btn--activo" : ""}`}
                                        onClick={() => setMedioPago(medio)}
                                    >
                                        {medio.charAt(0).toUpperCase() + medio.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carrito */}
                        <div className="sim-carrito">
                            <p className="sim-pago-label">Resumen</p>
                            {carrito.length === 0 ? (
                                <p className="sim-carrito-empty">Sin paquetes — solo se agregarán los turnos</p>
                            ) : (
                                <>
                                    {carrito.map((item, i) => (
                                        <div key={i} className="sim-carrito-item">
                                            <span>{item.label}</span>
                                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                <span>${item.precioCalculado.toLocaleString("es-AR")}</span>
                                                <button className="sim-carrito-quitar" onClick={() => quitarItem(i)}>×</button>
                                            </div>
                                        </div>
                                    ))}
                                    {conRecargo && (
                                        <div className="sim-carrito-item sim-recargo">
                                            <span>Recargo crédito (35%)</span>
                                            <span>+${(totalFinal - totalBase).toLocaleString("es-AR")}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="sim-total">
                                <span>Total</span>
                                <span className="sim-total-monto">${totalFinal.toLocaleString("es-AR")}</span>
                            </div>
                        </div>

                        <button className="sim-btn-confirmar" onClick={handleConfirmarAlumnoExistente}>
                            Confirmar y agregar turnos
                        </button>
                        <button className="sim-btn-volver" onClick={() => { setPantalla("buscar"); setCarrito([]) }}>
                            ← Volver
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Simulacion