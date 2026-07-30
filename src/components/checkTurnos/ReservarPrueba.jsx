import { collection, addDoc, Timestamp } from "firebase/firestore"
import { useForm } from 'react-hook-form'
import { db } from "../../firebase/firebaseConfig"
import { useState } from "react"
import { usePaquetes, getPrecio } from "../../helpers/usePaquetes"

const MEDIOS_PAGO = ["efectivo", "transferencia", "credito"]
const RECARGO_CREDITO = 0.35

const ReservarPrueba = ({
    setVentanaReservar,
    turnoSim,
    setRefresh,
    handleReservaConfirmada
}) => {
    const { register, handleSubmit } = useForm()
    const { paquetes, cargando } = usePaquetes()
    const turnos = turnoSim

    const [step, setStep] = useState(1)
    const totalSteps = 4
    const [carrito, setCarrito] = useState([])
    const [medioPago, setMedioPago] = useState("efectivo")
    const [tipoAuto, setTipoAuto] = useState("manual")
    

    if (cargando) return null

    const paquetesFiltrados = paquetes.filter(p =>
        tipoAuto === "manual" ? true : !p.soloManual
    )

    const conRecargo = medioPago === "credito"

    const totalBase = carrito.reduce((acc, item) => acc + item.precioCalculado, 0)
    const totalFinal = conRecargo
        ? Math.round(totalBase * (1 + RECARGO_CREDITO))
        : totalBase

    const contarPaq = (id) => carrito.filter(i => i.id === id).length

    const agregarPaq = (paq) => {
        const precioCalculado = getPrecio(paq, tipoAuto, false)
        setCarrito(prev => [...prev, { ...paq, precioCalculado }])
    }

    const quitarItem = (index) => {
        setCarrito(prev => prev.filter((_, i) => i !== index))
    }

    const handleTipoAuto = (tipo) => {
        setTipoAuto(tipo)
        if (tipo === "automatico") {
            setCarrito(prev => prev.filter(p => !p.soloManual))
        }
        // Recalcular precios del carrito
        setCarrito(prev => prev
            .filter(p => tipo === "automatico" ? !p.soloManual : true)
            .map(p => ({ ...p, precioCalculado: getPrecio(p, tipo, false) }))
        )
    }



    const enviar = async (data) => {
        try {
            const direccion = {
                calle: data.calle || "",
                altura: data.altura || "",
                entrecalles: data.entrecalles || ""
            }
            const puntoEncuentro = {
                calle: data.encuentroCalle || "",
                altura: data.encuentroAltura || "",
                entrecalles: data.encuentroEntrecalles || ""
            }

            const { calle, altura, entrecalles, encuentroCalle,
                encuentroAltura, encuentroEntrecalles, ...otrosCampos } = data

            const nuevaReserva = { ...otrosCampos, direccion, puntoEncuentro, turnos }
            const docRef = await addDoc(collection(db, "alumnos"), nuevaReserva)

            await Promise.all(carrito.map(item => {
                const precioFinal = conRecargo
                    ? Math.round(item.precioCalculado * (1 + RECARGO_CREDITO))
                    : item.precioCalculado

                return addDoc(collection(db, "pagos"), {
                    idAlumno: docRef.id,
                    nombreAlumno: data.nombre || "",
                    fecha: Timestamp.now(),
                    tipo: item.esExamen ? "examen" : "paquete",
                    paquete: item.esExamen ? null : item.id,
                    cantidadClases: item.clases,
                    monto: precioFinal,
                    montoBase: item.precioCalculado,
                    medioPago,
                    tipoAuto,
                    esAlumno: item.esExamen ? false : null,
                    recargoAplicado: conRecargo,
                })
            }))

            handleReservaConfirmada()
            setRefresh(prev => !prev)

        } catch (err) {
            console.error("Error guardando reserva:", err)
        }
    }

    const nextStep = (e) => { e.preventDefault(); e.stopPropagation(); if (step < totalSteps) setStep(step + 1) }
    const prevStep = (e) => { e.preventDefault(); e.stopPropagation(); if (step > 1) setStep(step - 1) }

    return (
        <div className="reserva-overlay">
            <div className="reserva-modal">
                <button type="button" className="reserva-close-btn" onClick={() => setVentanaReservar?.(false)}>&times;</button>

                <div className="reserva-header">
                    <h2 className="reserva-title">Reservar Turno</h2>
                    <div className="wizard-stepper">
                        <div className={`wizard-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
                            <div className="step-number">1</div>
                            <span className="step-label">Datos</span>
                        </div>
                        <div className="step-connector"></div>
                        <div className={`wizard-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
                            <div className="step-number">2</div>
                            <span className="step-label">Dirección</span>
                        </div>
                        <div className="step-connector"></div>
                        <div className={`wizard-step ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>
                            <div className="step-number">3</div>
                            <span className="step-label">Contacto</span>
                        </div>
                        <div className="step-connector"></div>
                        <div className={`wizard-step ${step >= 4 ? "active" : ""}`}>
                            <div className="step-number">4</div>
                            <span className="step-label">Pago</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(enviar)} className="reserva-form">
                    <div className="wizard-content">

                        {/* Step 1 */}
                        <div className={`wizard-panel ${step === 1 ? "visible" : ""}`}>
                            <div className="form-group">
                                <label className="reserva-label">Nombre</label>
                                <input type="text" {...register("nombre")} className="reserva-input" placeholder="Nombre completo" />
                            </div>
                            <div className="form-group">
                                <label className="reserva-label">DNI</label>
                                <input type="text" {...register("dni")} className="reserva-input" placeholder="Ingrese su DNI" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`wizard-panel ${step === 2 ? "visible" : ""}`}>
                            <fieldset className="address-fieldset">
                                <legend className="reserva-legend">Dirección</legend>
                                <div className="address-grid">
                                    <div className="form-group">
                                        <label className="reserva-label">Calle</label>
                                        <input type="text" {...register("calle")} className="reserva-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="reserva-label">Número</label>
                                        <input type="text" {...register("altura")} className="reserva-input" />
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label className="reserva-label">Entre calles</label>
                                        <input type="text" {...register("entrecalles")} className="reserva-input" />
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="address-fieldset">
                                <legend className="reserva-legend">Punto de encuentro</legend>
                                <div className="address-grid">
                                    <div className="form-group">
                                        <label className="reserva-label">Calle</label>
                                        <input type="text" {...register("encuentroCalle")} className="reserva-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="reserva-label">Número</label>
                                        <input type="text" {...register("encuentroAltura")} className="reserva-input" />
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label className="reserva-label">Entre calles</label>
                                        <input type="text" {...register("encuentroEntrecalles")} className="reserva-input" />
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        {/* Step 3 */}
                        <div className={`wizard-panel ${step === 3 ? "visible" : ""}`}>
                            <div className="form-group">
                                <label className="reserva-label">Teléfono</label>
                                <input type="text" {...register("telefono")} className="reserva-input" placeholder="Ej: 221-1234567" />
                            </div>
                            <div className="form-group">
                                <label className="reserva-label">E-mail</label>
                                <input type="email" {...register("correo")} className="reserva-input" placeholder="ejemplo@email.com" />
                            </div>
                            <div className="form-group">
                                <label className="reserva-label">Observaciones</label>
                                <textarea {...register("observaciones")} className="reserva-input reserva-textarea" placeholder="Notas adicionales..." rows={3} />
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className={`wizard-panel ${step === 4 ? "visible" : ""}`}>

                            {/* Tipo de auto */}
                            <div className="form-group">
                                <label className="reserva-label">Tipo de auto</label>
                                <div className="medio-grid">
                                    {["manual", "automatico"].map(tipo => (
                                        <div
                                            key={tipo}
                                            className={`medio-btn ${tipoAuto === tipo ? "medio-btn--activo" : ""}`}
                                            onClick={() => handleTipoAuto(tipo)}
                                        >
                                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            

                            {/* Paquetes */}
                            <div className="form-group">
                                <label className="reserva-label">Paquetes</label>
                                <div className="paq-grid">
                                    {paquetesFiltrados.map(paq => {
                                        const count = contarPaq(paq.id)
                                        const precio = getPrecio(paq, tipoAuto, false)
                                        return (
                                            <div
                                                key={paq.id}
                                                className={`paq-btn ${count > 0 ? "paq-btn--activo" : ""} ${paq.esExamen ? "paq-btn--examen" : ""}`}
                                                onClick={() => agregarPaq(paq)}
                                            >
                                                {count > 0 && <span className="paq-badge">{count}</span>}
                                                <span className="paq-nombre">{paq.label}</span>
                                                {paq.clases > 0 && (
                                                    <span className="paq-clases">{paq.clases} clase{paq.clases > 1 ? "s" : ""}</span>
                                                )}
                                                <span className="paq-precio">${precio.toLocaleString("es-AR")}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Medio de pago */}
                            <div className="form-group">
                                <label className="reserva-label">Medio de pago</label>
                                <div className="medio-grid">
                                    {MEDIOS_PAGO.map(medio => (
                                        <div
                                            key={medio}
                                            className={`medio-btn ${medioPago === medio ? "medio-btn--activo" : ""}`}
                                            onClick={() => setMedioPago(medio)}
                                        >
                                            {medio.charAt(0).toUpperCase() + medio.slice(1)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Carrito */}
                            <div className="pago-carrito">
                                <label className="reserva-label">Resumen</label>
                                {carrito.length === 0 ? (
                                    <p className="pago-carrito-empty">Sin paquetes seleccionados</p>
                                ) : (
                                    <>
                                        {carrito.map((item, i) => (
                                            <div key={i} className="pago-carrito-item">
                                                <span>{item.label}</span>
                                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                                    <span>${item.precioCalculado.toLocaleString("es-AR")}</span>
                                                    <button type="button" className="pago-carrito-quitar" onClick={() => quitarItem(i)}>×</button>
                                                </div>
                                            </div>
                                        ))}
                                        {conRecargo && (
                                            <div className="pago-carrito-item pago-recargo">
                                                <span>Recargo crédito (35%)</span>
                                                <span>+${(totalFinal - totalBase).toLocaleString("es-AR")}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="pago-total">
                                    <span>Total</span>
                                    <span className="pago-total-monto">${totalFinal.toLocaleString("es-AR")}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="reserva-footer">
                        <button type="button" className="reserva-btn reserva-btn-secondary" onClick={() => setVentanaReservar?.(false)}>
                            Cancelar
                        </button>
                        <div className="reserva-nav-buttons">
                            {step > 1 && (
                                <button type="button" className="reserva-btn reserva-btn-outline" onClick={prevStep}>
                                    Anterior
                                </button>
                            )}
                            {step < totalSteps ? (
                                <button type="button" className="reserva-btn reserva-btn-primary" onClick={nextStep}>
                                    Siguiente
                                </button>
                            ) : (
                                <button type="submit" className="reserva-btn reserva-btn-primary">
                                    Guardar turno
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReservarPrueba