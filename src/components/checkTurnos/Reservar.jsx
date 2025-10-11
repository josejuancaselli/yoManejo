import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Reservar = ({ setVentanaReservar, turnoSim, setTurnoSim, reserva, setReserva }) => {

    const {register, handleSubmit} = useForm();
    const turnos = turnoSim



const enviar = (data) =>{
    setReserva({ ...data, turnos: turnos })
    setVentanaReservar(false)
    setTurnoSim([])
}

    return (
        <>
            <div className="simulacion-modal">
                <form onSubmit={handleSubmit(enviar)}>
                    <label htmlFor="">Nombre</label>
                    <input type="text" {...register("nombre")} />

                    <label htmlFor="">DNI</label>
                    <input type="text"  {...register("dni")}/>

                    <label htmlFor="">Direccion</label>
                    <input type="text" {...register("direccion")}/>

                    <label htmlFor="">Telefono</label>
                    <input type="text" {...register("telefono")}/>

                    <label htmlFor="">E-mail</label>
                    <input type="text" {...register("correo")}/>

                    <label htmlFor="">Observaciones</label>
                    <input type="text" {...register("observaciones")}/>

                    <button type="submit">Guardar turno</button>
                    <button onClick={() => { setVentanaReservar(false) }}>Cerrar</button>
                </form>

            </div>
        </>
    )
}

export default Reservar