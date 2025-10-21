import React, { useState, useEffect } from "react";
import { useFechas } from "../../helpers/useFechas";
import AgregarTurno from "./AgregarTurno";

const EditarAlumno = ({

    ventanaAlumno,
    todosLosTurnos,
    alumnos,
    turnoModificandose,
    setTurnoModificandose,
    editarAlumno,
    setNuevoTurno,
    nuevoTurno,
    modoEdicion,
    setModoEdicion,
    alumnoSeleccionado,
    handleEditar,
    agregarTurno,
    alumno,
    borrarTurnoReservado,
    inputAgregarTurno,
    setInputAgregarTurno,
    toggleAlumno,
    borrarAlumno,
    obtenerHorarios,
    obtenerDiasDelMes
}) => {


    // Estado para controlar qué turno se está editando
    const [editarTurnos, setEditarTurnos] = useState(null);

    // Estado que mantiene una copia editable de los turnos
    const [turnosEditables, setTurnosEditables] = useState([]);

    // Cargamos los turnos al entrar en modo edición o al cambiar el alumno seleccionado
    useEffect(() => {
        if (alumnoSeleccionado.turnos) {
            setTurnosEditables(alumnoSeleccionado.turnos.map((t) => ({ ...t })));
        }
    }, [alumnoSeleccionado]);

    // Función para actualizar un turno editable
    const handleEditarTurno = (e, index, campo) => {
        const valor = ["dia", "mes", "anio"].includes(campo)
            ? Number(e.target.value)
            : e.target.value;

        const nuevosTurnos = [...turnosEditables];
        nuevosTurnos[index][campo] = valor;
        setTurnosEditables(nuevosTurnos);

        // También actualizamos alumnoSeleccionado para mantener todo sincronizado
        handleEditar(e, index, campo);
    };

    return (
        <div>
            <h2>Editar Alumno</h2>

            <p>Nombre</p>
            <input
                name="nombre"
                value={alumnoSeleccionado.nombre}
                onChange={handleEditar}
            />
            <p>DNI</p>
            <input
                name="dni"
                value={alumnoSeleccionado.dni}
                onChange={handleEditar}
            />
            <p>Dirección</p>
            <input
                name="direccion"
                value={alumnoSeleccionado.direccion}
                onChange={handleEditar}
            />
            <p>Correo</p>
            <input
                name="correo"
                value={alumnoSeleccionado.correo}
                onChange={handleEditar}
            />
            <p>Teléfono</p>
            <input
                name="telefono"
                value={alumnoSeleccionado.telefono}
                onChange={handleEditar}
            />
            <p>Observaciones</p>
            <input
                name="observaciones"
                value={alumnoSeleccionado.observaciones}
                onChange={handleEditar}
            />

            <h3>Turnos</h3>
            <div>
                <ul>
                    {turnosEditables.map((turno, index) => (
                        <li key={index}>
                            {/* Modo lectura si no estamos editando este turno */}
                            {editarTurnos !== index ? (
                                <div>
                                    <div>
                                        <p>
                                            {turno.dia}/{turno.mes + 1} - {turno.hora} hs - Zona {turno.zona}{" "}
                                        </p>
                                        <button onClick={() => setEditarTurnos(index)}>Editar Turno</button>
                                        <button onClick={() => borrarTurnoReservado(turno.dia, turno.hora, turno.mes, turno.zona, turno.anio, alumnoSeleccionado.id)}>
                                            Borrar Turno
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                // Modo edición
                                <div>
                                    <label>Día</label>
                                    <select
                                        value={turno.dia}
                                        onChange={(e) => handleEditarTurno(e, index, "dia")}
                                    >
                                        {obtenerDiasDelMes(turno.mes, turno.anio).map((d, i) => (
                                            <option key={i} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Mes</label>
                                    <select
                                        value={turno.mes}
                                        onChange={(e) => handleEditarTurno(e, index, "mes")}
                                    >
                                        {[...Array(12).keys()].map((m) => (
                                            <option key={m} value={m}>
                                                {m + 1}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Año</label>
                                    <input
                                        type="number"
                                        value={turno.anio}
                                        onChange={(e) => handleEditarTurno(e, index, "anio")}
                                    />

                                    <label>Hora</label>
                                    <select
                                        value={turno.hora}
                                        onChange={(e) => handleEditarTurno(e, index, "hora")}
                                    >
                                        {obtenerHorarios().map((h, i) => (
                                            <option key={i} value={h}>
                                                {h}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Zona</label>
                                    <select
                                        value={turno.zona}
                                        onChange={(e) => handleEditarTurno(e, index, "zona")}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>

                                    <div style={{ marginTop: "5px" }}>
                                        <button onClick={() => setEditarTurnos(null)}>Cerrar Edición</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <button onClick={() => setInputAgregarTurno(true)}>Agregar Turno</button>
            </div>
            <button onClick={() => editarAlumno(alumnoSeleccionado.id)}>Guardar Alumno</button>
            <button onClick={() => setModoEdicion(false)}>Cancelar</button>

            {inputAgregarTurno && (
                <AgregarTurno
                    inputAgregarTurno={inputAgregarTurno}
                    setInputAgregarTurno={setInputAgregarTurno}
                    agregarTurno={agregarTurno}
                    alumnoSeleccionado={alumnoSeleccionado}
                    setNuevoTurno={setNuevoTurno}
                    nuevoTurno={nuevoTurno}
                    obtenerDiasDelMes={obtenerDiasDelMes}
                    obtenerHorarios={obtenerHorarios}
                />
            )}
        </div>

    );
};

export default EditarAlumno;
