import { useEffect, useState, useMemo } from "react"
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import { Link } from "react-router-dom"
import { FaRegTrashAlt } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { usePaquetes } from "../../helpers/usePaquetes"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import "./contabilidad.css"

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const hoy = new Date()

const PERIODOS = [
    { id: "3m", label: "3 meses" },
    { id: "6m", label: "6 meses" },
    { id: "1a", label: "1 año" },
    { id: "custom", label: "Personalizada" },
]

const Contabilidad = () => {
    const [pagos, setPagos] = useState([])
    const [gastos, setGastos] = useState([])
    const [mes, setMes] = useState(hoy.getMonth())
    const [anio, setAnio] = useState(hoy.getFullYear())
    const [paqueteAbierto, setPaqueteAbierto] = useState(null)
    const [confirmarBorrado, setConfirmarBorrado] = useState(null)
    const { paquetes, cargando } = usePaquetes()

    const [periodo, setPeriodo] = useState("6m")
    const [customDesde, setCustomDesde] = useState({ mes: 0, anio: hoy.getFullYear() })
    const [customHasta, setCustomHasta] = useState({ mes: hoy.getMonth(), anio: hoy.getFullYear() })

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

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "gastos"), (snapshot) => {
            const lista = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
                fecha: d.data().fecha?.toDate()
            }))
            setGastos(lista)
        })
        return () => unsub()
    }, [])

    // ── Mes actual ──
    const pagosMes = useMemo(() =>
        pagos.filter(p =>
            p.fecha &&
            p.fecha.getMonth() === mes &&
            p.fecha.getFullYear() === anio
        ), [pagos, mes, anio])

    const totalMes = useMemo(() =>
        pagosMes.reduce((acc, p) => acc + (p.monto || 0), 0)
        , [pagosMes])

    const gastosMes = useMemo(() =>
        gastos.filter(g =>
            g.fecha &&
            g.fecha.getMonth() === mes &&
            g.fecha.getFullYear() === anio
        ), [gastos, mes, anio])

    const totalGastosMes = useMemo(() =>
        gastosMes.reduce((acc, g) => acc + (g.monto || 0), 0)
        , [gastosMes])

    const netoMes = totalMes - totalGastosMes

    const porTipoGastoMes = useMemo(() => {
        const mapa = {}
        gastosMes.forEach(g => {
            if (!mapa[g.nombreTipo]) mapa[g.nombreTipo] = 0
            mapa[g.nombreTipo] += g.monto || 0
        })
        return Object.entries(mapa)
            .map(([nombre, monto]) => ({ nombre, monto }))
            .sort((a, b) => b.monto - a.monto)
    }, [gastosMes])

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
                paq.id === "examen" ? p.tipo === "examen" : p.paquete === paq.id
            )
            return {
                ...paq,
                cantidad: ventas.length,
                total: ventas.reduce((acc, p) => acc + (p.monto || 0), 0),
                ventas
            }
        })
    }, [pagosMes, paquetes])

    const aniosDisponibles = useMemo(() => {
        const set = new Set(pagos.map(p => p.fecha?.getFullYear()).filter(Boolean))
        set.add(hoy.getFullYear())
        return [...set].sort((a, b) => b - a)
    }, [pagos])

    // ── Panel período ──
    const rangoFechas = useMemo(() => {
        const hasta = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        let desde

        if (periodo === "3m") {
            desde = new Date(hasta)
            desde.setMonth(desde.getMonth() - 2)
        } else if (periodo === "6m") {
            desde = new Date(hasta)
            desde.setMonth(desde.getMonth() - 5)
        } else if (periodo === "1a") {
            desde = new Date(hasta)
            desde.setMonth(desde.getMonth() - 11)
        } else {
            desde = new Date(customDesde.anio, customDesde.mes, 1)
            return {
                desde,
                hasta: new Date(customHasta.anio, customHasta.mes, 1),
                meses: Math.max(1,
                    (customHasta.anio - customDesde.anio) * 12 +
                    (customHasta.mes - customDesde.mes) + 1
                )
            }
        }

        const mesesCount = periodo === "3m" ? 3 : periodo === "6m" ? 6 : 12
        return { desde, hasta, meses: mesesCount }
    }, [periodo, customDesde, customHasta])

    const pagosPeriodo = useMemo(() =>
        pagos.filter(p => {
            if (!p.fecha) return false
            const fechaMes = new Date(p.fecha.getFullYear(), p.fecha.getMonth(), 1)
            return fechaMes >= rangoFechas.desde && fechaMes <= rangoFechas.hasta
        }), [pagos, rangoFechas])

    const gastosPeriodo = useMemo(() =>
        gastos.filter(g => {
            if (!g.fecha) return false
            const fechaMes = new Date(g.fecha.getFullYear(), g.fecha.getMonth(), 1)
            return fechaMes >= rangoFechas.desde && fechaMes <= rangoFechas.hasta
        }), [gastos, rangoFechas])

    const totalPeriodo = useMemo(() =>
        pagosPeriodo.reduce((acc, p) => acc + (p.monto || 0), 0)
        , [pagosPeriodo])

    const totalGastosPeriodo = useMemo(() =>
        gastosPeriodo.reduce((acc, g) => acc + (g.monto || 0), 0)
        , [gastosPeriodo])

    const netoPeriodo = totalPeriodo - totalGastosPeriodo

    const mediosPago = useMemo(() => {
        const medios = { efectivo: 0, transferencia: 0, credito: 0 }
        const counts = { efectivo: 0, transferencia: 0, credito: 0 }
        pagosPeriodo.forEach(p => {
            if (medios[p.medioPago] !== undefined) {
                medios[p.medioPago] += p.monto || 0
                counts[p.medioPago]++
            }
        })
        const max = Math.max(...Object.values(medios), 1)
        return Object.entries(medios).map(([key, monto]) => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            monto,
            count: counts[key],
            pct: Math.round((monto / max) * 100)
        }))
    }, [pagosPeriodo])

    const paquetesPeriodo = useMemo(() => {
        return paquetes.map(paq => {
            const ventas = pagosPeriodo.filter(p =>
                paq.id === "examen" ? p.tipo === "examen" : p.paquete === paq.id
            )
            return {
                ...paq,
                cantidad: ventas.length,
                total: ventas.reduce((acc, p) => acc + (p.monto || 0), 0),
            }
        })
    }, [pagosPeriodo, paquetes])

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

    const labelPeriodo = () => {
        if (periodo === "custom") {
            return `${MESES[customDesde.mes].slice(0, 3)} ${customDesde.anio} – ${MESES[customHasta.mes].slice(0, 3)} ${customHasta.anio}`
        }
        const labels = { "3m": "últimos 3 meses", "6m": "últimos 6 meses", "1a": "último año" }
        return labels[periodo]
    }

    const dataTortaMedios = useMemo(() =>
        mediosPago
            .filter(m => m.monto > 0)
            .map(m => ({ name: m.label, value: m.monto }))
        , [mediosPago])

    const dataTortaPaquetes = useMemo(() =>
        paquetesPeriodo
            .filter(p => p.total > 0)
            .map(p => ({ name: p.label, value: p.total }))
        , [paquetesPeriodo])

    const COLORES_TORTA = ["#8bcfbf", "#54b198", "#3d7d6a", "#2d4a44", "#dda8a8"]

    return (
        <div className="cont-wrapper">

            <div className="inicio-container">
                <div className="nav-bar">
                    <Link className="auto-title" to="/">Turnos</Link>
                    <Link className="auto-title" to="/alumnos">Alumnos</Link>
                    <Link className="auto-title" to="/profesores">Profesores</Link>
                    <Link className="auto-title" to="/contabilidad">Contabilidad</Link>
                </div>
            </div>

            <div className="cont-header">
                <h1 className="cont-titulo">Contabilidad</h1>
                <div className="cont-selector">
                    <select className="cont-select" value={mes} onChange={e => setMes(Number(e.target.value))}>
                        {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select className="cont-select" value={anio} onChange={e => setAnio(Number(e.target.value))}>
                        {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <div className="cont-content">

                {/* ── Columna izquierda ── */}
                <div className="cont-col">

                    {/* Resumen del mes */}
                    <div className="cont-card">
                        <p className="cont-card-label">Resumen — {MESES[mes]} {anio}</p>

                        <div className="cont-resumen-fila">
                            <span className="cont-resumen-label">Ingresos</span>
                            <span className="cont-total cont-total--ing">${totalMes.toLocaleString("es-AR")}</span>
                        </div>
                        <p className="cont-card-sub">{pagosMes.length} transacción{pagosMes.length !== 1 ? "es" : ""}</p>

                        <div className="cont-resumen-fila" style={{ marginTop: "8px" }}>
                            <span className="cont-resumen-label">Gastos</span>
                            <span className="cont-total cont-total--gasto">${totalGastosMes.toLocaleString("es-AR")}</span>
                        </div>

                        {porTipoGastoMes.length > 0 && (
                            <div className="cont-gastos-desglose">
                                {porTipoGastoMes.map(({ nombre, monto }) => (
                                    <div key={nombre} className="cont-gasto-tipo-row">
                                        <span className="cont-gasto-tipo-nombre">{nombre}</span>
                                        <span className="cont-gasto-tipo-monto">${monto.toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {gastosMes.length === 0 && (
                            <p className="cont-empty">Sin gastos registrados este mes</p>
                        )}

                        <div className="cont-neto">
                            <span className="cont-neto-label">Resultado neto</span>
                            <span className={`cont-neto-valor ${netoMes >= 0 ? "cont-neto--positivo" : "cont-neto--negativo"}`}>
                                ${netoMes.toLocaleString("es-AR")}
                            </span>
                        </div>
                    </div>

                    {/* Paquetes vendidos */}
                    <div className="cont-card">
                        <p className="cont-card-label">Paquetes vendidos</p>
                        <div className="cont-paquetes">
                            {!cargando && porPaquete.map(paq => (
                                <div key={paq.id}>
                                    <div
                                        className={`cont-paq-row ${paqueteAbierto === paq.id ? "cont-paq-row--abierto" : ""} ${paq.cantidad === 0 ? "cont-paq-row--vacio" : ""}`}
                                        onClick={() => paq.cantidad > 0 && togglePaquete(paq.id)}
                                    >
                                        <div className="cont-paq-info">
                                            <span className="cont-paq-nombre">{paq.label}</span>
                                            <span className="cont-paq-cantidad">{paq.cantidad} vendido{paq.cantidad !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span className="cont-paq-total">${paq.total.toLocaleString("es-AR")}</span>
                                            {paq.cantidad > 0 && (
                                                <span className="cont-paq-chevron">{paqueteAbierto === paq.id ? "▲" : "▼"}</span>
                                            )}
                                        </div>
                                    </div>

                                    {paqueteAbierto === paq.id && (
                                        <div className="cont-paq-detalle">

                                            {paq.ventas.map((venta, i) => (
                                                <div key={venta.id}>
                                                    {console.log(venta)}
                                                    <div className="cont-venta-row">
                                                        <div className="cont-venta-info">
                                                            <span className="cont-venta-nombre">{venta.nombreAlumno}</span>
                                                            {venta.dni && (
                                                                <span className="cont-venta-fecha">DNI: {venta.dni}</span>
                                                            )}
                                                            {venta.direccion?.calle && (
                                                                <span className="cont-venta-fecha">
                                                                    {venta.direccion.calle}
                                                                    {venta.direccion.altura ? ` ${venta.direccion.altura}` : ""}
                                                                    {venta.direccion.entrecalles ? ` (${venta.direccion.entrecalles})` : ""}
                                                                </span>
                                                            )}
                                                            <span className="cont-venta-fecha">
                                                                {venta.fecha.toLocaleDateString("es-AR")} — {venta.medioPago}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <span className="cont-venta-monto">${venta.monto.toLocaleString("es-AR")}</span>
                                                            {confirmarBorrado === venta.id ? (
                                                                <div className="cont-confirmar">
                                                                    <button className="cont-btn-si" onClick={() => borrarPago(venta.id)}>Confirmar</button>
                                                                    <button className="cont-btn-no" onClick={() => setConfirmarBorrado(null)}><IoIosClose /></button>
                                                                </div>
                                                            ) : (
                                                                <button className="cont-btn-borrar" onClick={() => setConfirmarBorrado(venta.id)} title="Eliminar registro">
                                                                    <FaRegTrashAlt />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {i < paq.ventas.length - 1 && <div className="cont-venta-divider" />}
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
                                            <div className="cont-dia-barra" style={{ width: `${Math.round((monto / totalMes) * 100)}%` }} />
                                        </div>
                                        <span className="cont-dia-monto">${monto.toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ── Panel período ── */}
            <div className="cont-panel-periodo">

                <div className="cont-panel-header">
                    <p className="cont-card-label">Resumen por período</p>
                    <div className="cont-periodo-btns">
                        {PERIODOS.map(p => (
                            <button
                                key={p.id}
                                className={`cont-periodo-btn ${periodo === p.id ? "cont-periodo-btn--activo" : ""}`}
                                onClick={() => setPeriodo(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {periodo === "custom" && (
                    <div className="cont-custom-rango">
                        <span className="cont-custom-label">Desde</span>
                        <select className="cont-select" value={customDesde.mes} onChange={e => setCustomDesde(prev => ({ ...prev, mes: Number(e.target.value) }))}>
                            {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <select className="cont-select" value={customDesde.anio} onChange={e => setCustomDesde(prev => ({ ...prev, anio: Number(e.target.value) }))}>
                            {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <span className="cont-custom-label">Hasta</span>
                        <select className="cont-select" value={customHasta.mes} onChange={e => setCustomHasta(prev => ({ ...prev, mes: Number(e.target.value) }))}>
                            {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <select className="cont-select" value={customHasta.anio} onChange={e => setCustomHasta(prev => ({ ...prev, anio: Number(e.target.value) }))}>
                            {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                )}

                <div className="cont-panel-body">

                    {/* Métricas principales */}
                    <div className="cont-panel-metricas">
                        <div className="cont-metrica">
                            <p className="cont-card-label">Ingresos — {labelPeriodo()}</p>
                            <p className="cont-total">${totalPeriodo.toLocaleString("es-AR")}</p>
                            <p className="cont-card-sub">{pagosPeriodo.length} transacciones</p>
                        </div>
                        <div className="cont-metrica">
                            <p className="cont-card-label">Gastos — {labelPeriodo()}</p>
                            <p className="cont-total cont-total--gasto cont-total--sm">
                                ${totalGastosPeriodo.toLocaleString("es-AR")}
                            </p>
                            <p className="cont-card-sub">{gastosPeriodo.length} registro{gastosPeriodo.length !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="cont-metrica">
                            <p className="cont-card-label">Neto — {labelPeriodo()}</p>
                            <p className={`cont-total cont-total--sm ${netoPeriodo >= 0 ? "cont-neto--positivo" : "cont-neto--negativo"}`}>
                                ${netoPeriodo.toLocaleString("es-AR")}
                            </p>
                        </div>
                    </div>

                    {/* Paquetes del período */}
                    <div className="cont-panel-seccion">
                        <p className="cont-card-label" style={{ marginBottom: "10px" }}>
                            Paquetes — {labelPeriodo()}
                        </p>
                        <div className="cont-paquetes">
                            {!cargando && paquetesPeriodo.map(paq => (
                                <div
                                    key={paq.id}
                                    className={`cont-paq-row ${paq.cantidad === 0 ? "cont-paq-row--vacio" : ""}`}
                                    style={{ cursor: "default" }}
                                >
                                    <div className="cont-paq-info">
                                        <span className="cont-paq-nombre">{paq.label}</span>
                                        <span className="cont-paq-cantidad">{paq.cantidad} vendido{paq.cantidad !== 1 ? "s" : ""}</span>
                                    </div>
                                    <span className="cont-paq-total">${paq.total.toLocaleString("es-AR")}</span>
                                </div>
                            ))}
                        </div>

                        {dataTortaPaquetes.length > 0 && (
                            <div className="cont-torta-wrapper">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={dataTortaPaquetes}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {dataTortaPaquetes.map((_, i) => (
                                                <Cell key={i} fill={COLORES_TORTA[i % COLORES_TORTA.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [`$${value.toLocaleString("es-AR")}`, name]}
                                            contentStyle={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => <span style={{ fontSize: "0.75rem", color: "#555" }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Medios de pago */}
                    <div className="cont-panel-seccion">
                        <p className="cont-card-label" style={{ marginBottom: "10px" }}>
                            Medios de pago — {labelPeriodo()}
                        </p>
                        <div className="cont-medios">
                            {mediosPago.map(({ key, label, monto, count, pct }) => (
                                <div key={key} className="cont-medio-row">
                                    <span className="cont-medio-label">{label}</span>
                                    <div className="cont-dia-barra-wrapper">
                                        <div className="cont-dia-barra" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="cont-medio-count">{count} pago{count !== 1 ? "s" : ""}</span>
                                    <span className="cont-dia-monto">${monto.toLocaleString("es-AR")}</span>
                                </div>
                            ))}
                        </div>

                        {dataTortaMedios.length > 0 && (
                            <div className="cont-torta-wrapper">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={dataTortaMedios}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {dataTortaMedios.map((_, i) => (
                                                <Cell key={i} fill={COLORES_TORTA[i % COLORES_TORTA.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [`$${value.toLocaleString("es-AR")}`, name]}
                                            contentStyle={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => <span style={{ fontSize: "0.75rem", color: "#555" }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>



                </div>
            </div>

        </div>
    )
}

export default Contabilidad