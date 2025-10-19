import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase/firebaseConfig"

export const useAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]) // aca traigo la base de datos con todos los alumnos y sus turnos
    const [alumnosFiltrados, setAlumnosFiltrados] = useState([]) // aca guardo los alumnos filtrados por la busqueda
    const [ventanaAlumno, setVentanaAlumno] = useState(null) // aca guardo el alumno que se muestra en la ventana de informacion
    const [busquedaAlumno, setBusquedaAlumno] = useState("") // aca guardo el valor del input de busqueda
    const [modoEdicion, setModoEdicion] = useState(false) // modo edicion para el formulario
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState({}) // aca guardo los datos del formulario para editar el alumno

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
    }, [])

    const toggleAlumno = (e) => { //funcion para abrir y cerrar la ventana de informacion del alumno
        setVentanaAlumno((prev) => {
            if (prev === null) { // si el estado es null, se abre la ventana
                return e;
            }
            else { // si el estado es true pasa lo siguiente
                if (prev.id === e.id) { //si el id del alumno clickeado es igual al id del alumno que ya esta en el estdo, se cierra la ventana
                    return null;
                }
                else { // si el id del alumno clickeado es diferente al id del alumno que ya esta en el estado, se cambia al nuevo alumno
                    return e;
                }
            }
        });
        
        setAlumnoSeleccionado(e); // se setea el alumno clickeado
    }


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
        } else {
            // Campo simple del alumno
            setAlumnoSeleccionado({ ...alumnoSeleccionado, [name]: valor });
        }
    };

    const editarAlumno = async (id) => {
        try {
            await updateDoc(doc(db, "alumnos", id), alumnoSeleccionado);// traigo al alumno con el update y su id, luego cargo el alumno modificado con alumnoSeleccionado, el cual se edito en handleEditar
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
        alumnos, setAlumnos, alumnosFiltrados, setAlumnosFiltrados, ventanaAlumno, setVentanaAlumno, busquedaAlumno, setBusquedaAlumno, modoEdicion, setModoEdicion, alumnoSeleccionado, setAlumnoSeleccionado,
        toggleAlumno, handleEditar, editarAlumno,normalizar, handleBusquedaAlumno, borrarAlumno
    }
}