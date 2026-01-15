import React from 'react'
import { IoIosClose } from 'react-icons/io'
import { useFechas } from '../../../helpers/useFechas';

const TurnosSimulados = ({ turnoSim, borrarTurnoSimulado }) => {

    const { fechaDesdeDia } = useFechas();

    return (

        <ul className="simulacion-card">
            {[...turnoSim.flat()]
                .sort((a, b) => {
                    const fechaA = new Date(a.anio, a.mes, a.dia, parseInt(a.hora));
                    const fechaB = new Date(b.anio, b.mes, b.dia, parseInt(b.hora));
                    return fechaA - fechaB
                })
                .map((e, index) => {
                    return (
                        <li key={index} className="simulacion-container">
                            <p className="simulacion-item">
                                {fechaDesdeDia(`${String(e.dia).padStart(2, "0")}/${String(e.mes + 1).padStart(2, "0")}/${e.anio}`)} - {String(e.dia).padStart(2, "0")}/{String(e.mes + 1).padStart(2, "0")} - {e.hora} hs - Zona {e.zona}

                            </p>
                            <button className="simulacion-delete-btn" onClick={() => { borrarTurnoSimulado(e.dia, e.hora, e.mes, e.zona, e.anio) }}><IoIosClose /></button>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default TurnosSimulados