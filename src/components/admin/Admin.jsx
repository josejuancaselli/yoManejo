import { useState, useEffect, useMemo } from "react"
import { usePaquetes } from "../../helpers/usePaquetes"
import { Link } from "react-router-dom"
import { collection, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import { FaRegTrashAlt } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import "./admin.css"

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const hoy = new Date()

const Admin = () => {
    const { paquetes, cargando, actualizarPrecio } = usePaquetes()
    const [precios, setPrecios] = useState({})
    const [guardado, setGuardado] = useState(null)

    // Tipos de gasto
    const [tiposGasto, setTiposGasto] = useState([])
    const [nuevoTipo, setNuevoTipo] = useState("")

    // Registrar gasto
    const [gastoTipo, setGastoTipo] = useState("")
    const [gastoMonto, setGastoMonto] = useState("")
    const [gastoFecha, setGastoFecha] = useState(hoy.toISOString().split("T")[0])
    const [gastoNota, setGastoNota] = useState("")
    const [gastoGuardado, setGastoGuardado] = useState(false)

    // Egresos
    const [gastos, setGastos] = useState([])
    const [mesGastos, setMesGastos] = useState(hoy.getMonth())
    const [anioGastos, setAnioGastos] = useState(hoy.getFullYear())
    const [confirmarBorradoGasto, setConfirmarBorradoGasto] = useState(null)

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "tiposGasto"), (snapshot) => {
            const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
            lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
            setTiposGasto(lista)
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

    const gastosMes = useMemo(() =>
        gastos
            .filter(g =>
                g.fecha &&
                g.fecha.getMonth() === mesGastos &&
                g.fecha.getFullYear() === anioGastos
            )
            .sort((a, b) => b.fecha - a.fecha)
    , [gastos, mesGastos, anioGastos])

    const totalGastosMes = useMemo(() =>
        gastosMes.reduce((acc, g) => acc + (g.monto || 0), 0)
    , [gastosMes])

    const gastosPorTipo = useMemo(() => {
        const mapa = {}
        gastosMes.forEach(g => {
            if (!mapa[g.nombreTipo]) mapa[g.nombreTipo] = []
            mapa[g.nombreTipo].push(g)
        })
        return Object.entries(mapa)
            .map(([nombre, items]) => ({
                nombre,
                items,
                total: items.reduce((acc, g) => acc + (g.monto || 0), 0)
            }))
            .sort((a, b) => b.total - a.total)
    }, [gastosMes])

    const aniosGastosDisponibles = useMemo(() => {
        const set = new Set(gastos.map(g => g.fecha?.getFullYear()).filter(Boolean))
        set.add(hoy.getFullYear())
        return [...set].sort((a, b) => b - a)
    }, [gastos])

    const handleChange = (id, campo, valor) => {
        setPrecios(prev => ({ ...prev, [`${id}_${campo}`]: valor }))
    }

    const handleGuardar = async (id, campo) => {
        const key = `${id}_${campo}`
        const precio = precios[key]
        if (!precio || isNaN(precio)) return
        await actualizarPrecio(id, campo, precio)
        setGuardado(key)
        setTimeout(() => setGuardado(null), 2000)
    }

    const camposPrecio = (paq) => {
        if (paq.esExamen) return [
            { campo: "precioManual", label: "Alumno — Manual" },
            { campo: "precioAutomatico", label: "Alumno — Automático" },
            { campo: "precioManualNoAlumno", label: "No alumno — Manual" },
            { campo: "precioAutomaticoNoAlumno", label: "No alumno — Automático" },
        ]
        if (paq.soloManual) return [
            { campo: "precioManual", label: "Manual" },
        ]
        return [
            { campo: "precioManual", label: "Manual" },
            { campo: "precioAutomatico", label: "Automático" },
        ]
    }

    const crearTipoGasto = async () => {
        if (!nuevoTipo.trim()) return
        await addDoc(collection(db, "tiposGasto"), {
            nombre: nuevoTipo.trim(),
            creadoEn: Timestamp.now()
        })
        setNuevoTipo("")
    }

    const borrarTipoGasto = async (id) => {
        await deleteDoc(doc(db, "tiposGasto", id))
    }

    const registrarGasto = async () => {
        if (!gastoTipo || !gastoMonto || !gastoFecha) return
        const tipo = tiposGasto.find(t => t.id === gastoTipo)
        const [anio, mes, dia] = gastoFecha.split("-").map(Number)
        await addDoc(collection(db, "gastos"), {
            idTipo: gastoTipo,
            nombreTipo: tipo.nombre,
            monto: Number(gastoMonto),
            fecha: Timestamp.fromDate(new Date(anio, mes - 1, dia)),
            notas: gastoNota.trim()
        })
        setGastoMonto("")
        setGastoNota("")
        setGastoGuardado(true)
        setTimeout(() => setGastoGuardado(false), 2000)
    }

    const borrarGasto = async (id) => {
        try {
            await deleteDoc(doc(db, "gastos", id))
            setConfirmarBorradoGasto(null)
        } catch (error) {
            console.error("Error borrando gasto:", error)
        }
    }

    return (
        <div className="admin-wrapper">
            <div className="inicio-container">
                <div className="nav-bar">
                    <Link className="auto-title" to="/">Turnos</Link>
                    <Link className="auto-title" to="/alumnos">Alumnos</Link>
                    <Link className="auto-title" to="/profesores">Profesores</Link>
                    <Link className="auto-title" to="/contabilidad">Contabilidad</Link>
                </div>
            </div>

            <div className="admin-header">
                <h1 className="admin-titulo">Administración</h1>
            </div>

            <div className="admin-content">

                {/* ── Precios ── */}
                <div className="admin-card">
                    <p className="admin-card-label">Precios de paquetes</p>
                    <p className="admin-card-sub">Los cambios se aplican inmediatamente a nuevas ventas. Las ventas anteriores no se modifican.</p>
                    {cargando ? (
                        <p className="admin-empty">Cargando...</p>
                    ) : (
                        <div className="admin-paquetes">
                            {paquetes.map(paq => (
                                <div key={paq.id} className="admin-paq-row">
                                    <div className="admin-paq-info">
                                        <span className="admin-paq-nombre">{paq.label}</span>
                                        {paq.clases > 0 && (
                                            <span className="admin-paq-clases">{paq.clases} clase{paq.clases > 1 ? "s" : ""}</span>
                                        )}
                                    </div>
                                    <div className="admin-paq-precios">
                                        {camposPrecio(paq).map(({ campo, label }) => {
                                            const key = `${paq.id}_${campo}`
                                            return (
                                                <div key={campo} className="admin-precio-fila">
                                                    <span className="admin-precio-tipo">{label}</span>
                                                    <span className="admin-paq-precio-valor">${(paq[campo] ?? 0).toLocaleString("es-AR")}</span>
                                                    <input
                                                        type="number"
                                                        className="admin-input"
                                                        placeholder="Nuevo precio"
                                                        value={precios[key] ?? ""}
                                                        onChange={e => handleChange(paq.id, campo, e.target.value)}
                                                    />
                                                    <button
                                                        className={`admin-btn-guardar ${guardado === key ? "admin-btn-guardado" : ""}`}
                                                        onClick={() => handleGuardar(paq.id, campo)}
                                                        disabled={!precios[key]}
                                                    >
                                                        {guardado === key ? "✓" : "Guardar"}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Categorías de gasto ── */}
                <div className="admin-card">
                    <p className="admin-card-label">Categorías de gasto</p>
                    <p className="admin-card-sub">Creá las categorías de gasto que necesitás. Las podés usar luego para registrar gastos.</p>

                    <div className="admin-nuevo-tipo">
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Ej: Nafta, Seguro, Sueldo..."
                            value={nuevoTipo}
                            onChange={e => setNuevoTipo(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && crearTipoGasto()}
                        />
                        <button className="admin-btn-guardar" onClick={crearTipoGasto} disabled={!nuevoTipo.trim()}>
                            Agregar
                        </button>
                    </div>

                    {tiposGasto.length === 0 ? (
                        <p className="admin-empty">Sin categorías creadas todavía</p>
                    ) : (
                        <div className="admin-tipos-lista">
                            {tiposGasto.map(tipo => (
                                <div key={tipo.id} className="admin-tipo-row">
                                    <span className="admin-tipo-nombre">{tipo.nombre}</span>
                                    <button className="admin-btn-borrar-tipo" onClick={() => borrarTipoGasto(tipo.id)}>
                                        <FaRegTrashAlt />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Registrar gasto ── */}
                <div className="admin-card">
                    <p className="admin-card-label">Registrar gasto</p>
                    <p className="admin-card-sub">Registrá un gasto puntual con su fecha y monto.</p>

                    {tiposGasto.length === 0 ? (
                        <p className="admin-empty">Primero creá al menos una categoría de gasto.</p>
                    ) : (
                        <div className="admin-gasto-form">
                            <div className="admin-gasto-fila">
                                <label className="admin-gasto-label">Categoría</label>
                                <select
                                    className="admin-input"
                                    value={gastoTipo}
                                    onChange={e => setGastoTipo(e.target.value)}
                                >
                                    <option value="">Seleccioná una categoría</option>
                                    {tiposGasto.map(t => (
                                        <option key={t.id} value={t.id}>{t.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-gasto-fila">
                                <label className="admin-gasto-label">Fecha</label>
                                <input
                                    type="date"
                                    className="admin-input"
                                    value={gastoFecha}
                                    onChange={e => setGastoFecha(e.target.value)}
                                />
                            </div>
                            <div className="admin-gasto-fila">
                                <label className="admin-gasto-label">Monto</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    placeholder="Ej: 15000"
                                    value={gastoMonto}
                                    onChange={e => setGastoMonto(e.target.value)}
                                />
                            </div>
                            <div className="admin-gasto-fila">
                                <label className="admin-gasto-label">Notas</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    placeholder="Opcional"
                                    value={gastoNota}
                                    onChange={e => setGastoNota(e.target.value)}
                                />
                            </div>
                            <button
                                className={`admin-btn-guardar ${gastoGuardado ? "admin-btn-guardado" : ""}`}
                                onClick={registrarGasto}
                                disabled={!gastoTipo || !gastoMonto || !gastoFecha}
                                style={{ alignSelf: "flex-end" }}
                            >
                                {gastoGuardado ? "✓ Registrado" : "Registrar gasto"}
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Egresos por mes ── */}
                <div className="admin-card">
                    <p className="admin-card-label">Egresos</p>
                    <p className="admin-card-sub">Revisá y eliminá gastos registrados por mes.</p>

                    <div className="admin-egresos-selector">
                        <select
                            className="admin-input"
                            value={mesGastos}
                            onChange={e => setMesGastos(Number(e.target.value))}
                        >
                            {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <select
                            className="admin-input"
                            value={anioGastos}
                            onChange={e => setAnioGastos(Number(e.target.value))}
                        >
                            {aniosGastosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>

                    {gastosMes.length === 0 ? (
                        <p className="admin-empty">Sin gastos registrados en este mes</p>
                    ) : (
                        <>
                            <div className="admin-egresos-total">
                                <span className="admin-egreso-total-label">Total del mes</span>
                                <span className="admin-egreso-total-monto">${totalGastosMes.toLocaleString("es-AR")}</span>
                            </div>

                            {gastosPorTipo.map(({ nombre, items, total }) => (
                                <div key={nombre} className="admin-egreso-grupo">
                                    <div className="admin-egreso-grupo-header">
                                        <span className="admin-egreso-grupo-nombre">{nombre}</span>
                                        <span className="admin-egreso-grupo-total">${total.toLocaleString("es-AR")}</span>
                                    </div>
                                    {items.map(gasto => (
                                        <div key={gasto.id} className="admin-egreso-row">
                                            <div className="admin-egreso-info">
                                                <span className="admin-egreso-fecha">
                                                    {gasto.fecha.toLocaleDateString("es-AR")}
                                                </span>
                                                {gasto.notas && (
                                                    <span className="admin-egreso-nota">{gasto.notas}</span>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <span className="admin-egreso-monto">${gasto.monto.toLocaleString("es-AR")}</span>
                                                {confirmarBorradoGasto === gasto.id ? (
                                                    <div className="admin-egreso-confirmar">
                                                        <button className="cont-btn-si" onClick={() => borrarGasto(gasto.id)}>
                                                            Confirmar
                                                        </button>
                                                        <button className="cont-btn-no" onClick={() => setConfirmarBorradoGasto(null)}>
                                                            <IoIosClose />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="cont-btn-borrar"
                                                        onClick={() => setConfirmarBorradoGasto(gasto.id)}
                                                        title="Eliminar gasto"
                                                    >
                                                        <FaRegTrashAlt />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Admin