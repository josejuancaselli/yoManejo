import { collection, addDoc } from "firebase/firestore"
import { useForm } from 'react-hook-form'
import { db } from "../../firebase/firebaseConfig";
import { useState } from "react";

const Reservar = ({ setVentanaReservar, setSimulacion, turnoSim, setTurnoSim, reserva, setReserva,setRefresh, warningReserva, setWarningReserva }) => {


    const { register, handleSubmit } = useForm();
    const turnos = turnoSim



const enviar = async (data) => {
    try {
        // 1️⃣ Armo el objeto completo de reserva
        const nuevaReserva = { ...data, turnos: turnos }

        // 2️⃣ Pusheo a Firebase
        await addDoc(collection(db, "alumnos"), nuevaReserva)

        // 3️⃣ Actualizo estado local
        setReserva(nuevaReserva)
        setVentanaReservar(false)
        setSimulacion(true)
        setWarningReserva(false)
        setRefresh(prev => !prev)
        

        console.log("Reserva guardada en Firebase ✅")
    } catch (err) {
        console.error("Error guardando reserva:", err)
    }
}


    return (
        <>
            <div className="reserva-modal">
                <form onSubmit={handleSubmit(enviar)} className='reserva-form'>
                    <label className='reserva-label'>Nombre</label>
                    <input type="text" {...register("nombre")} className='reserva-input' />

                    <label className='reserva-label'>DNI</label>
                    <input type="text"  {...register("dni")} className='reserva-input' />

                    <label className='reserva-label'>Dirección</label>
                    <input type="text" {...register("direccion")} className='reserva-input' />

                    <label className='reserva-label'>Teléfono</label>
                    <input type="text" {...register("telefono")} className='reserva-input' />

                    <label className='reserva-label'>E-mail</label>
                    <input type="text" {...register("correo")} className='reserva-input' />

                    <label className='reserva-label'>Observaciones</label>
                    <input type="text" {...register("observaciones")} className='reserva-input' />

                    <button type="submit">Guardar turno</button>
                    <button onClick={() => { setVentanaReservar(false) }}>Cerrar</button>
                </form>
            </div>
        </>
    )
}

export default Reservar