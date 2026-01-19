import { collection, addDoc } from "firebase/firestore"
import { useForm } from 'react-hook-form'
import { db } from "../../firebase/firebaseConfig";
import { useState } from "react";

const ReservarPrueba = ({setVentanaReservar,
    setSimulacion,
    turnoSim,
    setReserva,
    setRefresh,
    //   setWarningReserva, 
    //   setBotonReserva, 
    modoSimulacion, setModoSimulacion,
    handleReservaConfirmada }) =>  {


    const { register, handleSubmit } = useForm();
    const turnos = turnoSim
 const [step, setStep] = useState(1);
  const totalSteps = 3; 


    const enviar = async (data) => {
        try {
            // 🔹 Combino los campos de dirección en uno solo
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

            // 2️⃣ Armo el objeto completo de reserva, excluyendo los campos individuales
            const { calle, altura, entrecalles, encuentroCalle, encuentroAltura, encuentroEntrecalles, ...otrosCampos } = data;
            const nuevaReserva = { ...otrosCampos, direccion, puntoEncuentro, turnos };

            // 2️⃣ Pusheo a Firebase
            await addDoc(collection(db, "alumnos"), nuevaReserva)

            // 3️⃣ Actualizo estado local
            // setReserva(nuevaReserva)
            handleReservaConfirmada()
            setRefresh(prev => !prev)
            console.log("Reserva guardada en Firebase ✅")
            console.log(nuevaReserva)
        } catch (err) {
            console.error("Error guardando reserva:", err)
        }
    }

    const nextStep = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="reserva-overlay">
            <div className="reserva-modal">
                <button
                    type="button"
                    className="reserva-close-btn"
                    onClick={() => setVentanaReservar?.(false)}
                    aria-label="Cerrar"
                >
                    &times;
                </button>

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
                        <div className={`wizard-step ${step >= 3 ? "active" : ""}`}>
                            <div className="step-number">3</div>
                            <span className="step-label">Contacto</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(enviar)} className="reserva-form">
                    <div className="wizard-content">
                        {/* Step 1: Datos personales */}
                        <div className={`wizard-panel ${step === 1 ? "visible" : ""}`}>
                            <div className="form-group">
                                <label className="reserva-label">Nombre</label>
                                <input type="text" {...register("nombre")} className="reserva-input" placeholder="Ingrese su nombre completo" />
                            </div>
                            <div className="form-group">
                                <label className="reserva-label">DNI</label>
                                <input type="text" {...register("dni")} className="reserva-input" placeholder="Ingrese su DNI" />
                            </div>
                        </div>

                        {/* Step 2: Direcciones */}
                        <div className={`wizard-panel ${step === 2 ? "visible" : ""}`}>
                            <fieldset className="address-fieldset">
                                <legend className="reserva-legend">Direccion</legend>
                                <div className="address-grid">
                                    <div className="form-group">
                                        <label className="reserva-label">Calle</label>
                                        <input type="text" {...register("calle")} className="reserva-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="reserva-label">Numero</label>
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
                                        <label className="reserva-label">Numero</label>
                                        <input type="text" {...register("encuentroAltura")} className="reserva-input" />
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label className="reserva-label">Entre calles</label>
                                        <input type="text" {...register("encuentroEntrecalles")} className="reserva-input" />
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        {/* Step 3: Contacto */}
                        <div className={`wizard-panel ${step === 3 ? "visible" : ""}`}>
                            <div className="form-group">
                                <label className="reserva-label">Telefono</label>
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
                {/* <form onSubmit={handleSubmit(enviar)} className='reserva-form'>
                    <label className='reserva-label'>Nombre</label>
                    <input type="text" {...register("nombre")} className='reserva-input' />

                    <label className='reserva-label'>DNI</label>
                    <input type="text"  {...register("dni")} className='reserva-input' />

                    <label className="reserva-label"> Dirección</label>
                    <div style={{ display: "flex" }}>
                        <div>
                            <label className='reserva-label'>Calle</label>
                            <input type="text" {...register("calle")} className='reserva-input' />
                        </div>
                        <div>
                            <label className='reserva-label'>Número</label>
                            <input type="text" {...register("altura")} className='reserva-input' />
                        </div>
                        <div>
                            <label className='reserva-label'>Entre calles</label>
                            <input type="text" {...register("entrecalles")} className='reserva-input' />
                        </div>
                    </div>

                    <label className="reserva-label">Punto de encuentro</label>
                    <div style={{ display: "flex" }}>
                        <div>
                            <label className='reserva-label'>Calle</label>
                            <input type="text" {...register("calle")} className='reserva-input' />
                        </div>
                        <div>
                            <label className='reserva-label'>Número</label>
                            <input type="text" {...register("altura")} className='reserva-input' />
                        </div>
                        <div>
                            <label className='reserva-label'>Entre calles</label>
                            <input type="text" {...register("entrecalles")} className='reserva-input' />
                        </div>
                    </div>

                    <label className='reserva-label'>Teléfono</label>
                    <input type="text" {...register("telefono")} className='reserva-input' />

                    <label className='reserva-label'>E-mail</label>
                    <input type="text" {...register("correo")} className='reserva-input' />

                    <label className='reserva-label'>Observaciones</label>
                    <input type="text" {...register("observaciones")} className='reserva-input' />
                    <button type="submit">Guardar turno</button>
                    <button onClick={() => { setVentanaReservar(false) }}>Cerrar</button>
                </form> */}
            </div>
        </div>
    )
}

export default ReservarPrueba