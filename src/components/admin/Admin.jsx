import { useState } from "react"
import { usePaquetes } from "../../helpers/usePaquetes"
import { Link } from "react-router-dom"
import "./admin.css"

const Admin = () => {
    const { paquetes, cargando, actualizarPrecio } = usePaquetes()
    const [precios, setPrecios] = useState({})
    const [guardado, setGuardado] = useState(null)

    const handleChange = (id, valor) => {
        setPrecios(prev => ({ ...prev, [id]: valor }))
    }

    const handleGuardar = async (id) => {
        const precio = precios[id]
        if (!precio || isNaN(precio)) return
        await actualizarPrecio(id, precio)
        setGuardado(id)
        setTimeout(() => setGuardado(null), 2000)
    }

    return (
        <div className="admin-wrapper">
            <div className="inicio-container">
                <div className="nav-bar">
                    <Link className="auto-title" to="/turnos">Turnos</Link>
                    <Link className="auto-title" to="/alumnos">Alumnos</Link>
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
                                        <span className="admin-paq-clases">{paq.clases} clase{paq.clases > 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="admin-paq-precio-actual">
                                        <span className="admin-paq-precio-label">Precio actual</span>
                                        <span className="admin-paq-precio-valor">
                                            ${paq.precio.toLocaleString("es-AR")}
                                        </span>
                                    </div>
                                    <div className="admin-paq-editar">
                                        <input
                                            type="number"
                                            className="admin-input"
                                            placeholder="Nuevo precio"
                                            value={precios[paq.id] ?? ""}
                                            onChange={e => handleChange(paq.id, e.target.value)}
                                        />
                                        <button
                                            className={`admin-btn-guardar ${guardado === paq.id ? "admin-btn-guardado" : ""}`}
                                            onClick={() => handleGuardar(paq.id)}
                                            disabled={!precios[paq.id]}
                                        >
                                            {guardado === paq.id ? "✓ Guardado" : "Guardar"}
                                        </button>
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