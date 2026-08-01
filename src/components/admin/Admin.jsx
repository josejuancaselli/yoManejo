import { useState } from "react"
import { usePaquetes } from "../../helpers/usePaquetes"
import { Link } from "react-router-dom"
import "./admin.css"

const Admin = () => {
    const { paquetes, cargando, actualizarPrecio } = usePaquetes()
    const [precios, setPrecios] = useState({})
    const [guardado, setGuardado] = useState(null)

    const handleChange = (id, campo, valor) => {
        setPrecios(prev => ({
            ...prev,
            [`${id}_${campo}`]: valor
        }))
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
                <div className="admin-card">
                    <p className="admin-card-label">Precios de paquetes</p>
                    <p className="admin-card-sub">
                        Los cambios se aplican inmediatamente a nuevas ventas. Las ventas anteriores no se modifican.
                    </p>

                    {cargando ? (
                        <p className="admin-empty">Cargando...</p>
                    ) : (
                        <div className="admin-paquetes">
                            {paquetes.map(paq => (
                                <div key={paq.id} className="admin-paq-row">
                                    <div className="admin-paq-info">
                                        <span className="admin-paq-nombre">{paq.label}</span>
                                        {paq.clases > 0 && (
                                            <span className="admin-paq-clases">
                                                {paq.clases} clase{paq.clases > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>

                                    <div className="admin-paq-precios">
                                        {camposPrecio(paq).map(({ campo, label }) => {
                                            const key = `${paq.id}_${campo}`
                                            return (
                                                <div key={campo} className="admin-precio-fila">
                                                    <span className="admin-precio-tipo">{label}</span>
                                                    <span className="admin-paq-precio-valor">
                                                        ${(paq[campo] ?? 0).toLocaleString("es-AR")}
                                                    </span>
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
            </div>
        </div>
    )
}

export default Admin