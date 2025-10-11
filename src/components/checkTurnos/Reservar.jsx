import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Reservar = ({ setVentanaReservar, turnoSim, setTurnoSim, reserva, setReserva }) => {

    const { register, handleSubmit } = useForm();
    const turnos = turnoSim



    const enviar = (data) => {
        setReserva({ ...data, turnos: turnos })
        setVentanaReservar(false)
        setTurnoSim([])
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