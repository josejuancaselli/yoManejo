import React from 'react'
import { useAlumnos } from '../../helpers/useAlumnos'
import { useFechas } from '../../helpers/useFechas'

const EditarAlumno = ({ borrarTurnoReservado, turnoModificandose, todosLosTurnos,alumnos,setTurnoModificandose,alumnoSeleccionado, alumno, handleEditar, setModoEdicion, editarAlumno, setInputAgregarTurno, obtenerDiasDelMes, obtenerHorarios }) => {






    return (
        <>
            {console.log("Estos son todos los turnos de los alumnos'", todosLosTurnos)}
            {console.log("esto es alumnos'", alumnos.map(e => e.turnos).flat())}
            {/* {console.log("esta es la valdiacion de si existe el turno en alumnos", validacion)} */}
            {console.log("este es el turno modificandose", turnoModificandose)}
            <p> Nombre</p>
            <input name="nombre" value={alumnoSeleccionado.nombre} onChange={handleEditar} />
            <p> DNI</p>
            <input name="dni" value={alumnoSeleccionado.dni} onChange={handleEditar} />
            <p> Direccion</p>
            <input name="direccion" value={alumnoSeleccionado.direccion} onChange={handleEditar} />
            <p> E-mail</p>
            <input name="correo" value={alumnoSeleccionado.correo} onChange={handleEditar} />
            <p> Telefono</p>
            <input name="telefono" value={alumnoSeleccionado.telefono} onChange={handleEditar} />
            <p> Observaciones</p>
            <input name="observaciones" value={alumnoSeleccionado.observaciones} onChange={handleEditar} />
            <ul>


                {alumnoSeleccionado.turnos.map((turno, idx) => {
                    return (

                        <li key={idx}>
                            <label>Dia</label>
                            <select name="dia" value={turno.dia} onChange={(e) => handleEditar(e, idx, "dia")}>
                                {obtenerDiasDelMes(turno.mes, turno.anio).map((dia, index) => {
                                    return (
                                        <option key={index} value={dia}>{dia}</option>
                                    )
                                })}
                            </select>
                            <label>Mes</label>
                            <select name="mes" value={turno.mes} onChange={(e) => { handleEditar(e, idx, "mes") }}>
                                {[...Array.from({ length: 12 }, (_, i) => i + 0)].map((mes) => {
                                    return (
                                        <option key={mes} value={mes}>{mes + 1}</option> // mostramos 1-12, pero value sigue 0-11
                                    )
                                })}
                            </select>
                            <label>Año</label>
                            <input name="anio" value={turno.anio} onChange={(e) => handleEditar(e, idx, "anio")} />
                            <label>Hora</label>
                            <select name="hora" value={turno.hora} onChange={(e) => handleEditar(e, idx, "hora")}>
                                {obtenerHorarios().map((hora, index) => {
                                    return (
                                        <option key={index} value={hora}>{hora}</option>
                                    )
                                })}
                            </select>
                            <label>Zona</label>
                            <select name="zona" value={turno.zona} onChange={(e) => handleEditar(e, idx, "zona")}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            <button onClick={() => { borrarTurnoReservado(turno.dia, turno.hora, turno.mes, turno.zona, turno.anio, alumno.id) }}>Borrar turno</button>
                        </li>
                    )
                })}
            </ul>

            <button type="submit" onClick={() => { editarAlumno(alumno.id), setModoEdicion(false) }}>Guardar</button>
            <button type="button" onClick={() => { setModoEdicion(false), setInputAgregarTurno(false) }}>Cancelar</button>
            <button type="button" onClick={() => setInputAgregarTurno(true)}>Agregar Turno</button>
        </>
    )
}

export default EditarAlumno