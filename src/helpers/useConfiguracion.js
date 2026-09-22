import { useEffect, useState } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

const RECARGO_DEFAULT = 0.25

export const useConfiguracion = () => {
    const [recargo, setRecargo] = useState(RECARGO_DEFAULT)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const ref = doc(db, "configuracion", "recargo")

        const unsub = onSnapshot(ref, async (snapshot) => {
            if (snapshot.exists()) {
                setRecargo(snapshot.data().porcentaje ?? RECARGO_DEFAULT)
            } else {
                // Si no existe el documento lo crea con el valor por defecto
                await setDoc(ref, { porcentaje: RECARGO_DEFAULT })
                setRecargo(RECARGO_DEFAULT)
            }
            setCargando(false)
        }, () => {
            // Si Firebase falla usa el valor por defecto
            setRecargo(RECARGO_DEFAULT)
            setCargando(false)
        })

        return () => unsub()
    }, [])

    return { recargo, cargando }
}