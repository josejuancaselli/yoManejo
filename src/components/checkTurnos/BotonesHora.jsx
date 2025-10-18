import React, { useRef, useState } from 'react'


const BotonesHora = ({ ventanaRef, zona, horariosMañana, horariosTarde, toggleHora, alumnos, fecha, yaExiste, estaReservado, horarios, dia, ventanaDia, setVentanaReservado, ventanaReservado }) => {

    const [activeHora, setActiveHora] = useState(null);
    const [mañanaTarde, setMañanaTarde] = useState(null)
    const toggleMañanaTarde = (tipo) => {
        setMañanaTarde(prev => prev === tipo ? null : tipo)
    }



    return (
        <>

            <div ref={ventanaRef} className={`horarios-list ${ventanaDia === dia ? "visible" : ""}`} id={`horarios-${dia}`} >
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <button onClick={() => toggleMañanaTarde("mañana")}>Mañana</button>
                    <button onClick={() => toggleMañanaTarde("tarde")}>Tarde</button>
                </div>


                {mañanaTarde === "mañana" && (
                    <>

                        {horariosMañana().map((hora) => {

                            const reservado = estaReservado(dia, hora, fecha.mes + 1, zona, fecha.anio) || yaExiste(dia, hora, fecha.mes + 1, zona, fecha.anio);
                            const turno = { dia, hora, mes: fecha.mes + 1, anio: fecha.anio, zona };
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
                                        <div className="ventana-reservado-modal" onClick={(e) => e.stopPropagation()}>
                                            <p>{ventanaReservado.direccion}</p>
                                        </div>
                                    )}
                                </div>

                            );
                        })}
                    </>
                )}


                {mañanaTarde === "tarde" && (
                    <>
                        {horariosTarde().map((hora) => {

                            const reservado = estaReservado(dia, hora, fecha.mes + 1, zona, fecha.anio) || yaExiste(dia, hora, fecha.mes + 1, zona, fecha.anio);
                            const turno = { dia, hora, mes: fecha.mes + 1, anio: fecha.anio, zona };
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
                                        <div className="ventana-reservado-modal" onClick={(e) => e.stopPropagation()}>
                                            <p>{ventanaReservado.direccion}</p>
                                        </div>
                                    )}
                                </div>

                            );
                        })}
                    </>
                )}


            </div>
        </>


    )
}

export default BotonesHora