import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase/firebaseConfig"

export const useAlumnos = () => {
    const [refresh, setRefresh] = useState(false)
    const [alumnos, setAlumnos] = useState([])
    const [alumnosFiltrados, setAlumnosFiltrados] = useState([])
    const [ventanaAlumno, setVentanaAlumno] = useState(null)
    const [busquedaAlumno, setBusquedaAlumno] = useState("")
    const [modoEdicion, setModoEdicion] = useState(null)
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState({})
    const [turnoModificandose, setTurnoModificandose] = useState({})
    const [renderBusqueda, setRenderBusqueda] = useState(false)
    const [dataAlumno, setDataAlumno] = useState(false)

    const todosLosTurnos = alumnos.map((alumno) => alumno.turnos).flat()
    const validacion = todosLosTurnos.some((turno) =>
        turno.dia === turnoModificandose.dia &&
        turno.hora === turnoModificandose.hora &&
        turno.mes === turnoModificandose.mes &&
        turno.zona === turnoModificandose.zona &&
        turno.anio === turnoModificandose.anio
    )

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

useEffect(() => {
    if (!alumnoSeleccionado?.id) return
    const actualizado = alumnos.find(a => a.id === alumnoSeleccionado.id)
    console.log("sync effect - alumnoSeleccionado.id:", alumnoSeleccionado?.id)
    console.log("sync effect - actualizado:", actualizado)
    if (actualizado) setAlumnoSeleccionado(actualizado)
}, [alumnos])

    const toggleAlumno = (e) => {
        setVentanaAlumno((prev) => {
            if (prev === null) return e
            return prev.id === e.id ? null : e
        })
        setAlumnoSeleccionado({ ...e, turnos: e.turnos ? e.turnos.map(t => ({ ...t })) : [] })
    }

    const handleEditar = (e, idxTurno = null, campoTurno = null, tipoDireccion = null, subCampo = null) => {
        const { name, value } = e.target
        const camposNumericos = ["dia", "mes", "anio"]
        const valor = camposNumericos.includes(name) || camposNumericos.includes(campoTurno) ? Number(value) : value

        if (tipoDireccion && subCampo) {
            setAlumnoSeleccionado(prev => ({
                ...prev, [tipoDireccion]: { ...prev[tipoDireccion], [subCampo]: valor }
            }))
        } else if (idxTurno !== null && campoTurno) {
            const turnosActualizados = [...alumnoSeleccionado.turnos]
            turnosActualizados[idxTurno][campoTurno] = valor
            setAlumnoSeleccionado({ ...alumnoSeleccionado, turnos: turnosActualizados })
            setTurnoModificandose({ ...turnoModificandose, [campoTurno]: valor })
        } else {
            setAlumnoSeleccionado({ ...alumnoSeleccionado, [name]: valor })
        }
    }

    const editarAlumno = async (id) => {
        try {
            if (validacion) {
                alert("El turno ya existe")
                setTurnoModificandose({})
            } else {
                await updateDoc(doc(db, "alumnos", id), alumnoSeleccionado)
                setRefresh(prev => !prev)
                setTurnoModificandose({})
                setModoEdicion(false)
            }
        } catch (error) {
            console.error("Error actualizando alumno:", error)
        }
    }

    const normalizar = (str) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()

    const handleBusqueda = (e) => {
        const valor = e.target.value.toLowerCase()
        setBusquedaAlumno(valor)
        if (valor === "") {
            setAlumnosFiltrados([])
            setRenderBusqueda(false)
            return
        }
        const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(valor))
        setAlumnosFiltrados(filtrados)
        setRenderBusqueda(true)
    }

    const capturarAlumno = (id) => {
        const almn = alumnosFiltrados.filter((e) => e.id === id)
        const alumnoCopiaProfunda = { ...almn[0], turnos: almn[0].turnos ? almn[0].turnos.map(t => ({ ...t })) : [] }
        setAlumnoSeleccionado(alumnoCopiaProfunda)
        setDataAlumno(true)
        setRenderBusqueda(false)
    }

    const borrarAlumno = async (id) => {
        try {
            await deleteDoc(doc(db, "alumnos", id))
            setRefresh(prev => !prev)
            setDataAlumno(false)
        } catch (error) {
            console.error("Error borrando alumno:", error)
        }
    }

    return {
        alumnos, setAlumnos, alumnosFiltrados, setAlumnosFiltrados,
        ventanaAlumno, setVentanaAlumno, busquedaAlumno, setBusquedaAlumno,
        modoEdicion, setModoEdicion, alumnoSeleccionado, setAlumnoSeleccionado,
        toggleAlumno, handleEditar, editarAlumno, normalizar, borrarAlumno,
        turnoModificandose, setTurnoModificandose, todosLosTurnos, refresh,
        setRefresh, validacion, handleBusqueda, renderBusqueda, setRenderBusqueda,
        dataAlumno, setDataAlumno, capturarAlumno
    }
}