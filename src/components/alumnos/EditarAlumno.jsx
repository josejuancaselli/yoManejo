import React, { useState, useEffect } from "react";
import { useFechas } from "../../helpers/useFechas";
import AgregarTurno from "./AgregarTurno";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";


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
    obtenerDiasDelMes,
    editarTurnoAlumno,
    setEditarTurnoAlumno
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
        const turnoEditado = { ...nuevosTurnos[index], [campo]: valor };

        // --- Validación de duplicados ---
        const existeDuplicado = nuevosTurnos.some((t, i) =>
            i !== index &&
            t.dia === turnoEditado.dia &&
            t.mes === turnoEditado.mes &&
            t.anio === turnoEditado.anio &&
            t.hora === turnoEditado.hora &&
            t.zona === turnoEditado.zona
        );

        if (existeDuplicado) {
            alert("Ya existe un turno con esa fecha, hora y zona.");
            return; // Salimos sin guardar el cambio
        }

        // --- Si no hay duplicado, actualizamos ---
        nuevosTurnos[index] = turnoEditado;
        setTurnosEditables(nuevosTurnos);

        // Mantener sincronizado con alumnoSeleccionado
        handleEditar(e, index, campo);
    };


    return (
        <>
            {modoEdicion && (
                <>
                    {console.log(alumnoSeleccionado.id)}
                    <input name="nombre" value={alumnoSeleccionado.nombre} onChange={handleEditar} />
                    <p>DNI</p>
                    <input name="dni" value={alumnoSeleccionado.dni} onChange={handleEditar} />
                    <label>Dirección</label>
                    <input name="direccion" value={alumnoSeleccionado.direccion} onChange={handleEditar} />
                    <label>Correo</label>
                    <input name="correo" value={alumnoSeleccionado.correo} onChange={handleEditar} />
                    <label>Teléfono</label>
                    <input name="telefono" value={alumnoSeleccionado.telefono} onChange={handleEditar} />
                    <label>Observaciones</label>
                    <input name="observaciones" value={alumnoSeleccionado.observaciones} onChange={handleEditar} />
                    {/* <button onClick={() => editarAlumno(alumnoSeleccionado.id)}>Guardar Alumno</button> */}
                    <button onClick={() => { editarAlumno(alumnoSeleccionado.id); setModoEdicion(false) }}>Guardar cambios</button>
                    <button onClick={() => setModoEdicion(null)}>Cerrar</button>
                </>
            )}

            {modoEdicion === "turnosAlumno" && (
                <>
                    <h3>{alumnoSeleccionado.nombre}</h3>
                    <p>Direccion: {alumnoSeleccionado.direccion}</p>
                    <p>DNI: {alumnoSeleccionado.dni}</p>
                    <p>Telefono: {alumnoSeleccionado.telefono}</p>
                    <p>Correo: {alumnoSeleccionado.correo}</p>
                    <p>Observaciones: {alumnoSeleccionado.observaciones}</p>
                    <button onClick={() => setModoEdicion(alumnoSeleccionado.nombre)}>Editar</button>
                    <h3>Turnos:</h3>

                </>
            )}


        </>

    );
};

export default EditarAlumno;
