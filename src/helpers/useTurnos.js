import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const useTurnos = ({
    alumnoSeleccionado,
    setAlumnoSeleccionado,
    alumnos,
    setRefresh,
    handleEditar,
    setAlumnos
}) => {

    const [turnoSim, setTurnoSim] = useState([]);
    const [turnosEditables, setTurnosEditables] = useState([]);

    // =========================
    // SIMULADOS
    // =========================

    const borrarTurnoSimulado = (dia, hora, mes, zona, anio) => {
        setTurnoSim(prev =>
            prev.filter(
                (r) =>
                    !(r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona && r.anio === anio)
            )
        );
    };

const agregarTurno = async (idAlumno) => {
    try {
        const nuevosTurnos = [...alumnoSeleccionado.turnos, ...turnoSim];

        await updateDoc(doc(db, "alumnos", idAlumno), {
            turnos: nuevosTurnos
        });

        setAlumnoSeleccionado(prev => ({
            ...prev,
            turnos: nuevosTurnos
        }));

        // 🔥 CLAVE: actualizar lista global
        setAlumnos(prev =>
            prev.map(alumno =>
                alumno.id === idAlumno
                    ? { ...alumno, turnos: nuevosTurnos }
                    : alumno
            )
        );

        setRefresh(prev => !prev);
        setTurnoSim([]);

    } catch (error) {
        console.error("Error agregando turno:", error);
    }
};

    // =========================
    // RESERVADOS
    // =========================

    const borrarTurnoReservado = async (dia, hora, mes, zona, anio, idAlumno, confirmacion) => {
        const turnoBorrado = alumnoSeleccionado.turnos.filter(
            (turno) =>
                turno.dia !== dia ||
                turno.hora !== hora ||
                turno.mes !== mes ||
                turno.zona !== zona ||
                turno.anio !== anio
        );

        try {
            if (confirmacion === "si") {
                await updateDoc(doc(db, "alumnos", idAlumno), {
                    turnos: turnoBorrado
                });

                setRefresh(prev => !prev);

                setAlumnoSeleccionado(prev => ({
                    ...prev,
                    turnos: turnoBorrado
                }));
            }
        } catch (error) {
            console.error("Error borrando turno:", error);
        }
    };

    // =========================
    // EDICION
    // =========================

    const handleEditarTurno = (e, index, campo) => {
        const valor = ["dia", "mes", "anio"].includes(campo)
            ? Number(e.target.value)
            : e.target.value;

        const turnosAlumnos = alumnos.map((a) => a.turnos).flat();

        const nuevosTurnos = [...turnosEditables];
        const turnoEditado = {
            ...nuevosTurnos[index],
            [campo]: valor
        };

        const existeDuplicado = turnosAlumnos.some((t, i) =>
            i !== index &&
            t.dia === turnoEditado.dia &&
            t.mes === turnoEditado.mes &&
            t.anio === turnoEditado.anio &&
            t.hora === turnoEditado.hora &&
            t.zona === turnoEditado.zona
        );

        if (existeDuplicado) {
            alert("Ya existe un turno con esa fecha, hora y zona.");
            return;
        }

        nuevosTurnos[index] = turnoEditado;
        setTurnosEditables(nuevosTurnos);

        handleEditar(e, index, campo);
    };

    return {
        turnoSim,
        setTurnoSim,
        turnosEditables,
        setTurnosEditables,
        borrarTurnoSimulado,
        agregarTurno,
        borrarTurnoReservado,
        handleEditarTurno
    };
};