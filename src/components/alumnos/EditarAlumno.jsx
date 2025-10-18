import React from 'react'

const EditarAlumno = ({
    formAlumno,
    handleEditar,
    obtenerDiasDelMes,
    obtenerHorarios,
    borrarTurno,
    editarAlumno,
    alumno,
    setModoEdicion,
    setInputAgregarTurno
}) => {
    return (
        <>
            <label> Nombre</label>
            <input name="nombre" value={formAlumno.nombre} onChange={handleEditar} />
            <label> DNI</label>
            <input name="dni" value={formAlumno.dni} onChange={handleEditar} />
            <label> Direccion</label>
            <input name="direccion" value={formAlumno.direccion} onChange={handleEditar} />
            <label> E-mail</label>
            <input name="correo" value={formAlumno.correo} onChange={handleEditar} />
            <label> Telefono</label>
            <input name="telefono" value={formAlumno.telefono} onChange={handleEditar} />
            <label> Observaciones</label>
            <input name="observaciones" value={formAlumno.observaciones} onChange={handleEditar} />
            {formAlumno.turnos.map((turno, idx) => {
                return (

                    <div key={idx}>
                        <label>Dia</label>
                        {/* <input name="dia" value={turno.dia} onChange={(e) => handleEditar(e, idx, "dia")} /> */}
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

                        {/* <input name="mes" value={turno.mes} onChange={(e) => {handleEditar(e, idx, "mes")}} /> */}
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
                        {/* <input name={turno.hora} value={turno.hora} onChange={(e) => handleEditar(e, idx, "hora")} /> */}
                        <label>Zona</label>
                        <select name="zona" value={turno.zona} onChange={(e) => handleEditar(e, idx, "zona")}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <button onClick={() => { borrarTurno(turno.dia, turno.hora, turno.mes, turno.zona, turno.anio, alumno.id) }}>Borrar turno</button>
                    </div>
                )
            })}
            <button type="submit" onClick={() => editarAlumno(alumno.id)}>Guardar</button>
            <button type="button" onClick={() => { setModoEdicion(false), setInputAgregarTurno(false) }}>Cancelar</button>
            <button type="button" onClick={() => setInputAgregarTurno(true)}>Agregar Turno</button>
        </>
    )
}

export default EditarAlumno