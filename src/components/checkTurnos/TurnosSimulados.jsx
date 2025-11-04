import React from 'react'
import { IoIosClose } from 'react-icons/io'

const TurnosSimulados = ({turnoSim, borrarTurnoSimulado}) => {


    return (

        <ul className="simulacion-card">
            {turnoSim.map((e, index) => {
                return (
                    <li key={index} className="simulacion-container">
                        <p className="simulacion-item">
                            {String(e.dia).padStart(2, "0")}/{String(e.mes + 1).padStart(2, "0")} - {e.hora} hs - Zona {e.zona}
                        </p>
                        <button className="simulacion-delete-btn" onClick={() => { borrarTurnoSimulado(e.dia, e.hora, e.mes, e.zona, e.anio) }}><IoIosClose/></button>
                    </li>
                )
            })}
        </ul>
    )
}

export default TurnosSimulados