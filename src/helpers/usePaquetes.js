import { useEffect, useState } from "react"
import { collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export const PAQUETES_DEFAULT = [
    {
        id: "pack1",
        label: "1 clase",
        clases: 1,
        precioManual: 44000,
        precioAutomatico: 65000,
        soloManual: false,
        esExamen: false,
    },
    {
        id: "pack4",
        label: "4 clases",
        clases: 4,
        precioManual: 156000,
        precioAutomatico: 220000,
        soloManual: false,
        esExamen: false,
    },
    {
        id: "pack8",
        label: "8 clases",
        clases: 8,
        precioManual: 280000,
        precioAutomatico: 400000,
        soloManual: false,
        esExamen: false,
    },
    {
        id: "pack12",
        label: "12 clases",
        clases: 12,
        precioManual: 390000,
        precioAutomatico: null,
        soloManual: true,
        esExamen: false,
    },
    {
        id: "examen",
        label: "Examen",
        clases: 0,
        precioManual: 25000,
        precioAutomatico: 40000,
        precioManualNoAlumno: 44000,
        precioAutomaticoNoAlumno: 65000,
        soloManual: false,
        esExamen: true,
    },
]

export const usePaquetes = () => {
    const [paquetes, setPaquetes] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "paquetes"), async (snapshot) => {
            if (snapshot.empty) {
                await Promise.all(
                    PAQUETES_DEFAULT.map(p =>
                        setDoc(doc(db, "paquetes", p.id), { ...p })
                    )
                )
            } else {
                const lista = snapshot.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                }))
                const ordenados = PAQUETES_DEFAULT.map(def =>
                    lista.find(p => p.id === def.id) ?? def
                )
                setPaquetes(ordenados)
                setCargando(false)
            }
        })
        return () => unsub()
    }, [])

    const actualizarPrecio = async (id, campo, precio) => {
        await updateDoc(doc(db, "paquetes", id), { [campo]: Number(precio) })
    }

    return { paquetes, cargando, actualizarPrecio }
}

export const getPrecio = (paq, tipoAuto, esAlumno = true) => {
    if (paq.esExamen) {
        if (tipoAuto === "automatico") {
            return esAlumno ? paq.precioAutomatico : paq.precioAutomaticoNoAlumno
        }
        return esAlumno ? paq.precioManual : paq.precioManualNoAlumno
    }
    return tipoAuto === "automatico" ? paq.precioAutomatico : paq.precioManual
}