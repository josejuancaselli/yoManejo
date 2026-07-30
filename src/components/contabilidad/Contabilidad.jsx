import { useEffect, useState, useMemo } from "react"
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import { Link } from "react-router-dom"
import { FaRegTrashAlt } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { usePaquetes } from "../../helpers/usePaquetes"
import "./contabilidad.css"

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]


const hoy = new Date()

const Contabilidad = () => {
    const [pagos, setPagos] = useState([])
    const [mes, setMes] = useState(hoy.getMonth())
    const [anio, setAnio] = useState(hoy.getFullYear())
    const [paqueteAbierto, setPaqueteAbierto] = useState(null)
    const [confirmarBorrado, setConfirmarBorrado] = useState(null)
    const { paquetes, cargando } = usePaquetes()


    useEffect(() => {
        const unsub = onSnapshot(collection(db, "pagos"), (snapshot) => {
            const lista = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
                fecha: d.data().fecha?.toDate()
            }))
            setPagos(lista)
        })
        return () => unsub()
    }, [])

    const pagosMes = useMemo(() => {
        return pagos.filter(p =>
            p.fecha &&
            p.fecha.getMonth() === mes &&
            p.fecha.getFullYear() === anio
        )
    }, [pagos, mes, anio])

    const totalMes = useMemo(() =>
        pagosMes.reduce((acc, p) => acc + (p.monto || 0), 0)
        , [pagosMes])

    const porDia = useMemo(() => {
        const mapa = {}
        pagosMes.forEach(p => {
            const dia = p.fecha.getDate()
            mapa[dia] = (mapa[dia] || 0) + (p.monto || 0)
        })
        return Object.entries(mapa)
            .map(([dia, monto]) => ({ dia: Number(dia), monto }))
            .sort((a, b) => a.dia - b.dia)
    }, [pagosMes])

    const porPaquete = useMemo(() => {
        return paquetes.map(paq => {
            const ventas = pagosMes.filter(p =>
                paq.id === "suelta" ? p.tipo === "suelta" : p.paquete === paq.id
            )
            return {
                ...paq,
                cantidad: ventas.length,
                total: ventas.reduce((acc, p) => acc + (p.monto || 0), 0),
                ventas
            }
        })
    }, [pagosMes])

    const aniosDisponibles = useMemo(() => {
        const set = new Set(pagos.map(p => p.fecha?.getFullYear()).filter(Boolean))
        set.add(hoy.getFullYear())
        return [...set].sort((a, b) => b - a)
    }, [pagos])

    const borrarPago = async (id) => {
        try {
            await deleteDoc(doc(db, "pagos", id))
            setConfirmarBorrado(null)
        } catch (error) {
            console.error("Error borrando pago:", error)
        }
    }

    const togglePaquete = (id) => {
        setPaqueteAbierto(prev => prev === id ? null : id)
        setConfirmarBorrado(null)
    }

    return (
        <div className="cont-wrapper">

            <div className="inicio-container">
                <div className="nav-bar">
                    <Link className="auto-title" to="/turnos">Turnos</Link>
                    <Link className="auto-title" to="/alumnos">Alumnos</Link>
                    <Link className="auto-title" to="/profesores">Profesores</Link>
                </div>
            </div>

            <div className="cont-header">
                <h1 className="cont-titulo">Contabilidad</h1>
                <div className="cont-selector">
                    <select
                        className="cont-select"
                        value={mes}
                        onChange={e => setMes(Number(e.target.value))}
                    >
                        {MESES.map((m, i) => (
                            <option key={i} value={i}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="cont-select"
                        value={anio}
                        onChange={e => setAnio(Number(e.target.value))}
                    >
                        {aniosDisponibles.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="cont-content">

                {/* ── Columna izquierda ── */}
                <div className="cont-col">

                    <div className="cont-card">
                        <p className="cont-card-label">Total ingresado</p>
                        <p className="cont-card-label">{MESES[mes]} {anio}</p>
                        <p className="cont-total">${totalMes.toLocaleString("es-AR")}</p>
                        <p className="cont-card-sub">{pagosMes.length} transacción{pagosMes.length !== 1 ? "es" : ""}</p>
                    </div>

                    <div className="cont-card">
                        <p className="cont-card-label">Paquetes vendidos</p>
                        <div className="cont-paquetes">
                            {porPaquete.map(paq => (
                                <div key={paq.id}>

                                    {/* Fila del paquete */}
                                    <div
                                        className={`cont-paq-row ${paqueteAbierto === paq.id ? "cont-paq-row--abierto" : ""} ${paq.cantidad === 0 ? "cont-paq-row--vacio" : ""}`}
                                        onClick={() => paq.cantidad > 0 && togglePaquete(paq.id)}
                                    >
                                        <div className="cont-paq-info">
                                            <span className="cont-paq-nombre">{paq.label}</span>
                                            <span className="cont-paq-cantidad">
                                                {paq.cantidad} vendido{paq.cantidad !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span className="cont-paq-total">
                                                ${paq.total.toLocaleString("es-AR")}
                                            </span>
                                            {paq.cantidad > 0 && (
                                                <span className="cont-paq-chevron">
                                                    {paqueteAbierto === paq.id ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Lista expandible */}
                                    {paqueteAbierto === paq.id && (
                                        <div className="cont-paq-detalle">
                                            {paq.ventas.map((venta, i) => (
                                                <div key={venta.id}>
                                                    <div className="cont-venta-row">
                                                        <div className="cont-venta-info">
                                                            <span className="cont-venta-nombre">{venta.nombreAlumno}</span>
                                                            <span className="cont-venta-fecha">
                                                                {venta.fecha.toLocaleDateString("es-AR")} — {venta.medioPago}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <span className="cont-venta-monto">
                                                                ${venta.monto.toLocaleString("es-AR")}
                                                            </span>
                                                            {confirmarBorrado === venta.id ? (
                                                                <div className="cont-confirmar">
                                                                    <button
                                                                        className="cont-btn-si"
                                                                        onClick={() => borrarPago(venta.id)}
                                                                    >
                                                                        Confirmar
                                                                    </button>
                                                                    <button
                                                                        className="cont-btn-no"
                                                                        onClick={() => setConfirmarBorrado(null)}
                                                                    >
                                                                        <IoIosClose />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    className="cont-btn-borrar"
                                                                    onClick={() => setConfirmarBorrado(venta.id)}
                                                                    title="Eliminar registro"
                                                                >
                                                                    <FaRegTrashAlt />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {i < paq.ventas.length - 1 && (
                                                        <div className="cont-venta-divider" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── Columna derecha ── */}
                <div className="cont-col">
                    <div className="cont-card cont-card-dias">
                        <p className="cont-card-label">Ingresos por día</p>
                        {porDia.length === 0 ? (
                            <p className="cont-empty">Sin movimientos este mes</p>
                        ) : (
                            <div className="cont-dias-lista">
                                {porDia.map(({ dia, monto }) => (
                                    <div key={dia} className="cont-dia-row">
                                        <div className="cont-dia-fecha">
                                            <span className="cont-dia-num">{String(dia).padStart(2, "0")}</span>
                                            <span className="cont-dia-mes">{MESES[mes].slice(0, 3)}</span>
                                        </div>
                                        <div className="cont-dia-barra-wrapper">
                                            <div
                                                className="cont-dia-barra"
                                                style={{ width: `${Math.round((monto / totalMes) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="cont-dia-monto">${monto.toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Contabilidad