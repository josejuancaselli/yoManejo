import React, { useRef, useState } from 'react'


const BotonesHora = ({ ventanaRef, zona, activeHora, setActiveHora, mañanaTarde, setMañanaTarde, horariosMañana, horariosTarde, toggleHora, reservado, alumnos, fecha, horarios, dia, ventanaDia, ventanaDireccion, setVentanaDireccion }) => {

    return (
        <>

            <div ref={ventanaRef} className={`horarios-list ${ventanaDia === dia ? "visible" : ""}`} id={`horarios-${dia}`} >

                {mañanaTarde.includes("mañana") && (
                    <div>

                        {horariosMañana().map((hora) => {
                            const turno = { dia, hora, mes: fecha.mes, anio: fecha.anio, zona };
                            const alumnoCorrespondiente = alumnos.find(alumno =>
                                alumno.turnos.some(t =>
                                    t.dia === turno.dia &&
                                    t.mes === turno.mes &&
                                    t.anio === turno.anio &&
                                    t.hora === turno.hora &&
                                    t.zona.toString() === turno.zona.toString()
                                )
                            );
                            return (
                                <div key={hora} style={{ position: "relative", display: "inline-block", margin: "0 2px" }}>
                                    <button
                                        key={hora}
                                        className="horario-btn"
                                        onClick={() => toggleHora(dia, hora, fecha.mes, zona)}
                                        onMouseEnter={() => {
                                            if (alumnoCorrespondiente) {
                                                setActiveHora(hora);
                                                setVentanaDireccion(alumnoCorrespondiente);

                                            }
                                        }}
                                        onMouseLeave={() => {
                                            setActiveHora(null);
                                            setVentanaDireccion(null)
                                        }}
                                        style={{
                                            backgroundColor: reservado(dia, hora, fecha.mes, zona, fecha.anio) ? "rgba(196, 136, 131, 1)" : "#54b198",
                                            color: reservado(dia, hora, fecha.mes, zona, fecha.anio) ? "white" : "black",
                                        }}
                                    >
                                        {hora}
                                    </button>
                                    {activeHora === hora && ventanaDireccion && (
                                        <div className="ventana-reservado-modal" onClick={(e) => e.stopPropagation()}>
                                            <p>{ventanaDireccion.nombre}</p>
                                            <p>{ventanaDireccion.direccion["calle"]} {ventanaDireccion.direccion["entrecalles"]}</p>
                                        </div>
                                    )}
                                </div>

                            );
                        })}
                    </div>
                )}


                {mañanaTarde.includes("tarde") && (

                    <div>
                        {horariosTarde().map((hora) => {
                            const turno = { dia, hora, mes: fecha.mes, anio: fecha.anio, zona };
                            const alumnoCorrespondiente = alumnos.find(alumno =>
                                alumno.turnos.some(t =>
                                    t.dia === turno.dia &&
                                    t.mes === turno.mes &&
                                    t.anio === turno.anio &&
                                    t.hora === turno.hora &&
                                    t.zona.toString() === turno.zona.toString()
                                )
                            );

                            return (
                                <div key={hora} style={{ position: "relative", display: "inline-block", margin: "0 2px" }}>
                                    <button
                                        key={hora}
                                        className="horario-btn"
                                        onClick={() => toggleHora(dia, hora, fecha.mes, zona)}
                                        onMouseEnter={() => {
                                            if (alumnoCorrespondiente) {
                                                setActiveHora(hora);
                                                setVentanaDireccion(alumnoCorrespondiente);
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            setActiveHora(null);
                                            setVentanaDireccion(null)
                                        }}
                                        style={{
                                            backgroundColor: reservado(dia, hora, fecha.mes, zona, fecha.anio) ? "rgba(196, 136, 131, 1)" : "#54b198",
                                            color: reservado(dia, hora, fecha.mes, zona, fecha.anio) ? "white" : "black",
                                        }}
                                    >
                                        {hora}
                                    </button>

                                    {activeHora === hora && ventanaDireccion && (
                                        <div className="ventana-reservado-modal" onClick={(e) => e.stopPropagation()}>
                                            <p>{ventanaDireccion.nombre}</p>
                                            <p>{ventanaDireccion.direccion["calle"]} {ventanaDireccion.direccion["altura"]}</p>

                                        </div>
                                    )}
                                </div>

                            );
                        })}
                    </div>
                )}

            </div>
        </>


    )
}

export default BotonesHora