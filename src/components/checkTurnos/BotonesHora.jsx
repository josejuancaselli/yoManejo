import React, { useState } from 'react'
import VentanaReservado from './VentanaReservado';

const BotonesHora = ({ ventanaRef, zona, toggleHora, alumnos, fecha, yaExiste, estaReservado, horarios, dia, ventanaDia }) => {

    const [activeHora, setActiveHora] = useState(null);
    const [ventanaReservado, setVentanaReservado] = useState(null)

    return (
        <>
            <div ref={ventanaRef} className={`horarios-list ${ventanaDia === dia ? "visible" : ""}`} id={`horarios-${dia}`} >

                {horarios.map((hora) => {

                    const reservado = estaReservado(dia, hora, fecha.mes + 1, zona) || yaExiste(dia, hora, fecha.mes + 1, zona);
                    // buscamos alumno correspondiente si el turno ya existe
                    const turno = {
                        dia, hora, mes: fecha.mes + 1, anio: fecha.anio, zona

                    };
                    const alumnoCorrespondiente = alumnos.find(alumno =>
                        alumno.turnos.some(t =>
                            t.dia === turno.dia &&
                            t.mes === turno.mes &&
                            t.anio === turno.anio &&
                            t.hora === turno.hora &&
                            
                            t.zona.toString() === turno.zona.toString()
                        )
                    );

                    const direAlumno = alumnoCorrespondiente && alumnoCorrespondiente.direccion

                    return (

                        <div key={hora} style={{ position: "relative", display: "inline-block" }}>
                            {console.log(direAlumno)}
                            <button
                                key={hora}
                                className="horario-btn"
                                onClick={() => toggleHora(dia, hora, fecha.mes + 1, zona, direAlumno)}
                                onMouseEnter={() => {
                                    if (alumnoCorrespondiente) {
                                        setActiveHora(hora);
                                        setVentanaReservado(alumnoCorrespondiente);
                                    }
                                }}
                                onMouseLeave={() => {
                                    setActiveHora(null);
                                    setVentanaReservado(null)
                                }}
                                style={{
                                    backgroundColor: reservado ? "rgba(196, 136, 131, 1)" : "#54b198",
                                    color: reservado ? "white" : "black",
                                }}
                            >
                                {hora}
                            </button>
                            {activeHora === hora && ventanaReservado && (
                                <VentanaReservado
                                    setVentanaReservado={setVentanaReservado}
                                    ventanaReservado={ventanaReservado}
                                />
                            )}
                        </div>

                    );
                })}
            </div>
        </>


    )
}

export default BotonesHora