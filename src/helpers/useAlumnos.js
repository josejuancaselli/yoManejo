import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase/firebaseConfig"

export const useAlumnos = () => {
    const [refresh, setRefresh] = useState(false) // aca guardo el alumno guardado en la base de datos y dispara el useEffect de [setAlumnoGuardado]
    const [alumnos, setAlumnos] = useState([]) // aca traigo la base de datos con todos los alumnos y sus turnos
    const [alumnosFiltrados, setAlumnosFiltrados] = useState([]) // aca guardo los alumnos filtrados por la busqueda
    const [ventanaAlumno, setVentanaAlumno] = useState(null) // aca guardo el alumno que se muestra en la ventana de informacion
    const [busquedaAlumno, setBusquedaAlumno] = useState("") // aca guardo el valor del input de busqueda
    const [modoEdicion, setModoEdicion] = useState(null) // modo edicion para el formulario
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState({}) // aca guardo los datos del formulario para editar el alumno
    const [turnoModificandose, setTurnoModificandose] = useState({}) // aca guardo los datos del formulario para editar el turno
    const [confirmar, setConfirmar] = useState(null)
    const todosLosTurnos = alumnos.map((alumno) => alumno.turnos).flat()
    const validacion = todosLosTurnos.some((turno) =>
        turno.dia === turnoModificandose.dia &&
        turno.hora === turnoModificandose.hora &&
        turno.mes === turnoModificandose.mes &&
        turno.zona === turnoModificandose.zona &&
        turno.anio === turnoModificandose.anio);



    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const alumnosCollection = collection(db, "alumnos")
                const alumnosSnapshot = await getDocs(alumnosCollection)
                const alumnosList = alumnosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setAlumnos(alumnosList)
            } catch (error) {
                console.error("Error cargando alumnos desde Firebase:", error)
            }
        }
        fetchAlumnos()
    }, [refresh])

    const toggleAlumno = (e) => {
        setVentanaAlumno((prev) => {
            if (prev === null) {
                return e;
            } else {
                if (prev.id === e.id) {
                    return null;
                } else {
                    return e;
                }
            }
        });

        setAlumnoSeleccionado({ ...e, turnos: e.turnos ? e.turnos.map(t => ({ ...t })) : [] });

    };

    const handleEditar = (e, idxTurno = null, campoTurno = null) => {
        const { name, value } = e.target;

        // Detectamos si el campo debería ser numérico
        const camposNumericos = ["dia", "mes", "anio"];
        const valor = camposNumericos.includes(name) || camposNumericos.includes(campoTurno) ? Number(value) : value;

        if (idxTurno !== null && campoTurno) {
            // Estamos editando un campo dentro de un turno
            const turnosActualizados = [...alumnoSeleccionado.turnos];
            turnosActualizados[idxTurno][campoTurno] = valor;
            setAlumnoSeleccionado({ ...alumnoSeleccionado, turnos: turnosActualizados });
            setTurnoModificandose({ ...turnoModificandose, [campoTurno]: valor });
        } else {
            // Campo simple del alumno
            setAlumnoSeleccionado({ ...alumnoSeleccionado, [name]: valor });
        }
    };

    const editarAlumno = async (id) => {
        try {
            if (validacion) {
                alert("El turno ya existe");
                setTurnoModificandose({});
            } else {
                await updateDoc(doc(db, "alumnos", id), alumnoSeleccionado);// traigo al alumno con el update y su id, luego cargo el alumno modificado con alumnoSeleccionado, el cual se edito en handleEditar
                setRefresh(prev => !prev); // 👈 esto “dispara” el useEffect
                setTurnoModificandose({});
                setModoEdicion(false);
            }

        } catch (error) {
            console.error("Error actualizando alumno:", error);
        }
    };

    // Función para normalizar strings y eliminar tildes y diacríticos
    const normalizar = (str) =>
        str
            .normalize("NFD")             // separa letra y tilde
            .replace(/[\u0300-\u036f]/g, "") // quita tildes
            .toLowerCase()                // minúscula
            .trim()                       // quita espacios al inicio y fin

    const handleBusquedaAlumno = (e) => { // funcion que setea con alumnos la const alumnosFiltrados. Puede ser 1, 2 o mil alumnos
        setBusquedaAlumno(e.target.value)
        const valor = e.target.value.toLowerCase()
        const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(valor))
        setAlumnosFiltrados(filtrados)
    }

    const borrarAlumno = async (id) => {
        try {
            await deleteDoc(doc(db, "alumnos", id));
            console.log(`Alumno con id ${id} borrado correctamente`);
        } catch (error) {
            console.error("Error borrando alumno:", error);
        }
    };



    return {
        alumnos, setAlumnos, alumnosFiltrados, setAlumnosFiltrados, ventanaAlumno, setVentanaAlumno, busquedaAlumno,
        setBusquedaAlumno, modoEdicion, setModoEdicion, alumnoSeleccionado, setAlumnoSeleccionado,
        toggleAlumno, handleEditar, editarAlumno, normalizar, handleBusquedaAlumno, borrarAlumno, turnoModificandose,
        setTurnoModificandose, todosLosTurnos, refresh, setRefresh, validacion, confirmar, setConfirmar
    }
}