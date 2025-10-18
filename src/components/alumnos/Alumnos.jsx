import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import AlumnoData from './AlumnoData'

const Alumnos = () => {
    const [alumnos, setAlumnos] = useState([]) // aca traigo la base de datos con todos los alumnos y sus turnos
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState({}) // aca guardo los alumnos filtrados por la busqueda
    const [ventanaAlumno, setVentanaAlumno] = useState(null) // aca guardo el alumno que se muestra en la ventana de informacion
    const [busqueda, setBusqueda] = useState("") // aca guardo el valor del input de busqueda
    const [modoEdicion, setModoEdicion] = useState(false) // modo edicion para el formulario
    const [formAlumno, setFormAlumno] = useState({}) // aca guardo los datos del formulario para editar el alumno
    
    const [nuevoTurno, setNuevoTurno] = useState({
        dia: "",
        mes: "",
        hora: "",
        zona: "",
        anio:""
    })

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

    const toggleAlumno = (alumno) => { //funcion para abrir y cerrar la ventana de informacion del alumno
        setVentanaAlumno((prev) => {
            if (prev === null) { // si el estado es null, se abre la ventana
                return alumno;
            }
            else { // si el estado es true pasa lo siguiente
                if (prev.id === alumno.id) { //si el id del alumno clickeado es igual al id del alumno que ya esta en el estdo, se cierra la ventana
                    return null;
                }
                else { // si el id del alumno clickeado es diferente al id del alumno que ya esta en el estado, se cambia al nuevo alumno
                    return alumno;
                }
            }
        });
        setModoEdicion(false);
        setFormAlumno(alumno); // al abrir, el formulario toma los valores actuales
    }


    const handleEditar = (e, idxTurno = null, campoTurno = null) => {
        const { name, value } = e.target;

        // Detectamos si el campo debería ser numérico
        const camposNumericos = ["dia", "mes","anio"];
        const valor = camposNumericos.includes(name) || camposNumericos.includes(campoTurno) ? Number(value) : value;

        if (idxTurno !== null && campoTurno) {
            // Estamos editando un campo dentro de un turno
            const turnosActualizados = [...formAlumno.turnos];
            turnosActualizados[idxTurno][campoTurno] = valor;
            setFormAlumno({ ...formAlumno, turnos: turnosActualizados });
        } else {
            // Campo simple del alumno
            setFormAlumno({ ...formAlumno, [name]: valor });
        }
    };


    const editarAlumno = async (id) => {
        try {
            // traigo al alumno con el update y su id, luego cargo el alumno modificado con formAlumno, el cual se edito en handleEditar
            await updateDoc(doc(db, "alumnos", id), formAlumno);

            setModoEdicion(false);
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

    const handleBusqueda = (e) => {
        setBusqueda(e.target.value)
        const valor = e.target.value.toLowerCase()
        const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(valor))
        setAlumnoSeleccionado(filtrados)
    }

    const borrarAlumno = async (id) => {
        try {
            await deleteDoc(doc(db, "alumnos", id));
            console.log(`Alumno con id ${id} borrado correctamente`);
        } catch (error) {
            console.error("Error borrando alumno:", error);
        }
    };

    const borrarTurno = async (dia, hora, mes, zona, anio, idAlumno) => {
        const arrayTurnosAlumno = formAlumno.turnos;

        const turnoBorrado = arrayTurnosAlumno.filter((turno) => turno.dia !== dia || turno.hora !== hora || turno.mes !== mes || turno.zona !== zona || turno.anio !== anio);
        try {
            await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
            alert("turno borrado con exito")
        } catch (error) {
            console.error("Error borrando turno:", error);
        }

    }

    const agregarTurno = async (idAlumno) => {
        const id = formAlumno.turnos.length+1
        try {
            const turnoActualizado = { ...formAlumno, turnos: [...formAlumno.turnos, { id,...nuevoTurno }] }
            // 1️⃣ Actualiza en Firebase con el nuevo objeto
            await updateDoc(doc(db, "alumnos", idAlumno), turnoActualizado);
            // 2️⃣ Actualiza el estado local
            setFormAlumno(turnoActualizado);
            // 3️⃣ Limpia el formulario
            setNuevoTurno({ dia: "", mes: "", hora: "", zona: "" });
            
        } catch (error) {
            console.error("Error agregando turno:", error);
        }
    };


    return (
        <div>

            <input
                type="text"
                value={busqueda}
                onChange={handleBusqueda}
            />

            <div>
                {/* render para los alumnos filtrados */}
                {alumnoSeleccionado.length > 0 ?
                    (alumnoSeleccionado.map((alumno, index) => {

                        return (
                            <div key={index}>
                                <AlumnoData
                                    toggleAlumno={toggleAlumno}
                                    alumno={alumno}
                                    ventanaAlumno={ventanaAlumno}
                                    modoEdicion={modoEdicion}
                                    setModoEdicion={setModoEdicion}
                                    formAlumno={formAlumno}
                                    handleEditar={handleEditar}
                                    editarAlumno={editarAlumno}
                                    borrarAlumno={borrarAlumno}
                                    borrarTurno={borrarTurno}
                                    setFormAlumno={setFormAlumno}
                                    nuevoTurno={nuevoTurno}
                                    setNuevoTurno={setNuevoTurno}
                                    agregarTurno={agregarTurno}
                                    inputAgregarTurno={inputAgregarTurno}
                                    setInputAgregarTurno={setInputAgregarTurno}
                                />
                            </div>
                        )
                    }))

                    :

                    /* render para los alumnos filtrados */
                    (alumnos.map((alumno, index) => {


                        return (
                            <div key={index}>
                                <AlumnoData
                                    toggleAlumno={toggleAlumno}
                                    alumno={alumno}
                                    ventanaAlumno={ventanaAlumno}
                                    modoEdicion={modoEdicion}
                                    setModoEdicion={setModoEdicion}
                                    formAlumno={formAlumno}
                                    handleEditar={handleEditar}
                                    editarAlumno={editarAlumno}
                                    borrarAlumno={borrarAlumno}
                                    borrarTurno={borrarTurno}
                                    setFormAlumno={setFormAlumno}
                                    nuevoTurno={nuevoTurno}
                                    setNuevoTurno={setNuevoTurno}
                                    agregarTurno={agregarTurno}
                                />
                            </div>
                        )
                    }))
                }
            </div>
        </div>
    )
}

export default Alumnos
