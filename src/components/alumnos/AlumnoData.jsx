import { useState } from "react";
import { useFechas } from "../../helpers/useFechas";
import AgregarTurno from "./AgregarTurno";
import EditarAlumno from "./EditarAlumno";



const AlumnoData = ({
    toggleAlumno,
    nuevoTurno,
    setNuevoTurno,
    agregarTurno,
    borrarAlumno,
    editarAlumno,
    handleEditar,
    formAlumno,
    alumno,
    modoEdicion,
    setModoEdicion,
    ventanaAlumno,
    borrarTurno
}) => {

    const [inputAgregarTurno, setInputAgregarTurno] = useState("")
    const { diasDelMes, obtenerDiasDelMes, cambioMes, fecha, setFecha } = useFechas();
    const horariosMañana = () => [...Array.from({ length: 5 }, (_, i) => `${i + 7}:45`)];
    const horariosTarde = () => [...Array.from({ length: 5 }, (_, i) => `${i + 14}:00`)];
    const obtenerHorarios = () => [horariosMañana(), horariosTarde()].flat();



    return (
        <>

            <h2 onClick={() => toggleAlumno(alumno)}>{alumno.nombre}</h2>

            {ventanaAlumno && ventanaAlumno.id === alumno.id && (
                <div>
                    {!modoEdicion ? (
                        <>
                            <h3>{alumno.nombre}</h3>
                            <p>Direccion: {alumno.direccion}</p>
                            <p>DNI: {alumno.dni}</p>
                            <p>Telefono: {alumno.telefono}</p>
                            <p>Correo: {alumno.correo}</p>
                            <p>Observaciones: {alumno.observaciones}</p>

                            <h3>Turnos:</h3>

                            <ul>
                                {alumno.turnos.map((turno, index) => {
                                    return (
                                        <li key={index}>
                                            {turno.dia}/{turno.mes + 1} - {turno.hora} hs - Zona {turno.zona}
                                        </li>
                                    )
                                })}
                            </ul>
                            <button onClick={() => setModoEdicion(true)}>Editar</button>
                            <button onClick={() => borrarAlumno(alumno.id)}>Borrar alumno</button>
                        </>
                    ) : (
                        <div>

                            <EditarAlumno
                                formAlumno={formAlumno}
                                handleEditar={handleEditar}                                
                                obtenerDiasDelMes={obtenerDiasDelMes}
                                obtenerHorarios={obtenerHorarios}
                                borrarTurno={borrarTurno}
                                editarAlumno={editarAlumno}
                                alumno={alumno}
                                setModoEdicion={setModoEdicion}
                                setInputAgregarTurno={setInputAgregarTurno}
                            />

                        </div>
                    )}

                    {/*Modal para agregar turno */}
                    {inputAgregarTurno && (
                        <div>
                            <AgregarTurno
                                nuevoTurno={nuevoTurno}
                                setNuevoTurno={setNuevoTurno}
                                obtenerDiasDelMes={obtenerDiasDelMes}
                                fecha={fecha}
                                obtenerHorarios={obtenerHorarios}
                                agregarTurno={agregarTurno}
                                alumno={alumno}
                                setInputAgregarTurno={setInputAgregarTurno}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default AlumnoData


