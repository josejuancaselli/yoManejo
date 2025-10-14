
import { useState } from 'react'

const AlumnoData = ({ toggleAlumno, nuevoTurno, setNuevoTurno, agregarTurno, borrarAlumno, editarAlumno, handleEditar, formAlumno, alumno, modoEdicion, setModoEdicion, ventanaAlumno, borrarTurno }) => {
    const [inputAgregarTurno, setInputAgregarTurno] = useState(false)


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
                            <p>Observaciones: {alumno.observaciones}</p>
                            <p>{alumno.anio}</p>
                            <h3>Turnos:</h3>

                            <ul>
                                {alumno.turnos.map((turno, index) => {
                                    return (
                                        <li key={index}>
                                            {turno.dia}/{turno.mes} - {turno.hora} hs - Zona {turno.zona}
                                        </li>
                                    )
                                })}
                            </ul>
                            <button onClick={() => setModoEdicion(true)}>Editar</button>
                            <button onClick={() => borrarAlumno(alumno.id)}>Borrar alumno</button>
                        </>
                    ) : (
                        <>
                            <label htmlFor=""> nombre</label>
                            <input name="nombre" value={formAlumno.nombre} onChange={handleEditar} />
                            <label htmlFor=""> dni</label>
                            <input name="dni" value={formAlumno.dni} onChange={handleEditar} />
                            <label htmlFor=""> direccion</label>
                            <input name="direccion" value={formAlumno.direccion} onChange={handleEditar} />
                            <label htmlFor=""> observaciones</label>
                            <input name="observaciones" value={formAlumno.observaciones} onChange={handleEditar} />
                            {formAlumno.turnos.map((turno, idx) => {
                                return (
                                    <div key={idx}>
                                        <label htmlFor=""> Dia</label>
                                        <input name={turno.dia} value={turno.dia} onChange={(e) => handleEditar(e, idx, "dia")} />
                                        <label htmlFor=""> Mes</label>
                                        <input name={turno.mes} value={turno.mes} onChange={(e) => handleEditar(e, idx, "mes")} />
                                        <label htmlFor=""> hora</label>
                                        <input name={turno.hora} value={turno.hora} onChange={(e) => handleEditar(e, idx, "hora")} />
                                        <label htmlFor=""> Zona</label>
                                        <input name={turno.zona} value={turno.zona} onChange={(e) => handleEditar(e, idx, "zona")} />
                                        <button onClick={() => { borrarTurno(turno.dia, turno.hora, turno.mes, turno.zona, alumno.id) }}>Borrar turno</button>
                                    </div>
                                )
                            })}
                            <button onClick={() => editarAlumno(alumno.id)}>Guardar</button>
                            <button onClick={() => {setModoEdicion(false), setInputAgregarTurno(false)}}>Cancelar</button>
                            <button onClick={() => setInputAgregarTurno(true)}>Agregar Turno</button>
                        </>
                    )}

                    {/*Modal para agregar turno */}
                    {inputAgregarTurno && (
                        <div>
                            <label>Dia</label>
                            <input type="number" value={nuevoTurno.dia} onChange={(e) => setNuevoTurno({ ...nuevoTurno, dia: Number(e.target.value) })} />

                            <label>Mes</label>
                            <input type="number" value={nuevoTurno.mes} onChange={(e) => setNuevoTurno({ ...nuevoTurno, mes: Number(e.target.value) })} />

                            <label>Hora</label>
                            <input type="text" value={nuevoTurno.hora} onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: (e.target.value) })} />

                            <label>Zona</label>
                            <input type="text" value={nuevoTurno.zona} onChange={(e) => setNuevoTurno({ ...nuevoTurno, zona: (e.target.value) })} />

                            <button onClick={() => { agregarTurno(alumno.id) }}>Confirmar</button>
                            <button onClick={() => setInputAgregarTurno(false)}>Cancelar</button>
                        </div>
                    )}
                </div>
            )}




        </>
    )
}

export default AlumnoData


