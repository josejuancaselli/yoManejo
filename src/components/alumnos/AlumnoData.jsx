import { useState } from "react";



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
    const horariosMañana = () => [...Array.from({ length: 5 }, (_, i) => `${i + 7}:45`)];
    const horariosTarde = () => [...Array.from({ length: 5 }, (_, i) => `${i + 14}:00`)];
    const obtenerHorarios = () => [horariosMañana(), horariosTarde()].flat();

const arrayTurnosAlumno = formAlumno.turnos;

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
                            <label htmlFor=""> E-mail</label>
                            <input name="correo" value={formAlumno.correo} onChange={handleEditar} />
                            <label htmlFor=""> E-mail</label>
                            <input name="telefono" value={formAlumno.telefono} onChange={handleEditar} />
                            <label htmlFor=""> observaciones</label>
                            <input name="observaciones" value={formAlumno.observaciones} onChange={handleEditar} />
                            {formAlumno.turnos.map((turno, idx) => {
                                return (
                                    <div key={idx}>
                                        <label htmlFor="">Dia</label>
                                        <input name="dia" value={turno.dia} onChange={(e) => handleEditar(e, idx, "dia")} />
                                        <label htmlFor="">Mes</label>
                                        <input name="mes" value={turno.mes} onChange={(e) => handleEditar(e, idx, "mes")} />
                                        <label htmlFor="">Año</label>
                                        <input name="anio" value={turno.anio} onChange={(e) => handleEditar(e, idx, "anio")} />
                                        <label htmlFor="">Hora</label>
                                        <select name="hora" value={turno.hora} onChange={(e) => handleEditar(e, idx, "hora")}>
                                            {obtenerHorarios().map((hora, index) => {
                                                return (
                                                    <option key={index} value={`${hora}`}>{hora}</option>
                                                )
                                            })}
                                        </select>
                                        {/* <input name={turno.hora} value={turno.hora} onChange={(e) => handleEditar(e, idx, "hora")} /> */}
                                        <label htmlFor="">Zona</label>
                                        <select name="zona" value={turno.zona} onChange={(e) => handleEditar(e, idx, "zona")}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>


                                        <button onClick={() => { borrarTurno(turno.dia, turno.hora, turno.mes, turno.zona, turno.anio, alumno.id) }}>Borrar turno</button>
                                    </div>
                                )
                            })}
                            <button onClick={() => editarAlumno(alumno.id)}>Guardar</button>
                            <button onClick={() => { setModoEdicion(false), setInputAgregarTurno(false) }}>Cancelar</button>
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
                            <select name="hora" value={nuevoTurno.hora} onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: (e.target.value) })}>
                                
                                {obtenerHorarios().map((hora, index) => {
                                    return (
                                        <option key={index} value={`${hora}`}>{hora}</option>
                                    )
                                })}
                            </select>

                            <label>Zona</label>
                            <input type="text" value={nuevoTurno.zona} onChange={(e) => setNuevoTurno({ ...nuevoTurno, zona: (e.target.value) })} />

                            <label>Año</label>
                            <input type="number" value={nuevoTurno.anio} onChange={(e) => setNuevoTurno({ ...nuevoTurno, anio: Number(e.target.value) })} />

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


