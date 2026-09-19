import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig"
import Login from "./Login"

const RutaProtegida = ({ children }) => {
    const [usuario, setUsuario] = useState(undefined)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setUsuario(user)
        })
        return () => unsub()
    }, [])

    if (usuario === undefined) return null // cargando

    if (!usuario) return <Login />

    return children
}

export default RutaProtegida