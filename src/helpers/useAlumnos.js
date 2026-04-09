import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore"
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
    const [renderBusqueda, setRenderBusqueda] = useState(false)
    const [dataAlumno, setDataAlumno] = useState(false)

    const todosLosTurnos = alumnos.map((alumno) => alumno.turnos).flat()
    const validacion = todosLosTurnos.some((turno) =>
        turno.dia === turnoModificandose.dia &&
        turno.hora === turnoModificandose.hora &&
        turno.mes === turnoModificandose.mes &&
        turno.zona === turnoModificandose.zona &&
        turno.anio === turnoModificandose.anio);



    useEffect(() => {
        const alumnosCollection = collection(db, "alumnos")

        const unsubscribe = onSnapshot(alumnosCollection, (snapshot) => {
            const alumnosList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAlumnos(alumnosList)
        }, (error) => {
            console.error("Error en onSnapshot alumnos:", error)
        })

        return () => unsubscribe()
    }, [])

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

    const handleEditar = (e, idxTurno = null, campoTurno = null, tipoDireccion = null, subCampo = null) => {
        const { name, value } = e.target;

        // Campos numéricos
        const camposNumericos = ["dia", "mes", "anio"];
        const valor = camposNumericos.includes(name) || camposNumericos.includes(campoTurno) ? Number(value) : value;

        if (tipoDireccion && subCampo) {
            // Estamos editando un subcampo de la dirección
            setAlumnoSeleccionado(prev => ({
                ...prev, [tipoDireccion]: { ...prev[tipoDireccion], [subCampo]: valor }
            }));
        } else if (idxTurno !== null && campoTurno) {
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

    // const handleBusquedaAlumno = (e) => { 
    //     setBusquedaAlumno(e.target.value)
    //     const valor = e.target.value.toLowerCase()
    //     const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(valor))
    //     setAlumnosFiltrados(filtrados)
    // }

    const handleBusqueda = (e) => {
        const valor = e.target.value.toLowerCase();
        setBusquedaAlumno(valor);
        if (valor === "") {
            // Si el input está vacío, dejamos el array vacío
            setAlumnosFiltrados([]);
            setRenderBusqueda(false); // opcional, si depende de que haya resultados
            return;
        }
        // Filtramos los alumnos
        const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(valor));
        setAlumnosFiltrados(filtrados);
        setRenderBusqueda(true); //  se activa solo si hay algo escrito
    };

    const capturarAlumno = (id) => { // funcion que setea el alumnoSeleccionado a partir del Id
        const almn = alumnosFiltrados.filter((e) => e.id === id)
        const alumnoCopiaProfunda = { ...almn[0], turnos: almn[0].turnos ? almn[0].turnos.map(t => ({ ...t })) : [] }
        setAlumnoSeleccionado(alumnoCopiaProfunda)
        setDataAlumno(true)
        setRenderBusqueda(false)
    }

    const borrarAlumno = async (id) => {
        try {
            await deleteDoc(doc(db, "alumnos", id));
            setRefresh(prev => !prev); // 👈 esto “dispara” el useEffect
            setDataAlumno(false)
            console.log(`Alumno con id ${id} borrado correctamente`);
        } catch (error) {
            console.error("Error borrando alumno:", error);
        }
        console.log(id)
    };



    return {
        alumnos, setAlumnos, alumnosFiltrados, setAlumnosFiltrados, ventanaAlumno, setVentanaAlumno, busquedaAlumno,
        setBusquedaAlumno, modoEdicion, setModoEdicion, alumnoSeleccionado, setAlumnoSeleccionado,
        toggleAlumno, handleEditar, editarAlumno, normalizar, borrarAlumno, turnoModificandose,
        setTurnoModificandose, todosLosTurnos, refresh, setRefresh, validacion, handleBusqueda, renderBusqueda, setRenderBusqueda, dataAlumno, setDataAlumno, capturarAlumno
    }
}