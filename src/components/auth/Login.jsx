import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig"
import "./login.css"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError("")
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch {
            setError("Credenciales incorrectas")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={handleLogin}>
                <h2 className="login-titulo">Acceso restringido</h2>
                <p className="login-sub">Ingresá tus credenciales para continuar</p>

                <div className="login-group">
                    <label className="login-label">Email</label>
                    <input
                        className="login-input"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@ejemplo.com"
                        autoComplete="username"
                    />
                </div>

                <div className="login-group">
                    <label className="login-label">Contraseña</label>
                    <input
                        className="login-input"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>

                {error && <p className="login-error">{error}</p>}

                <button
                    className="login-btn"
                    type="submit"
                    disabled={cargando || !email || !password}
                >
                    {cargando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </div>
    )
}

export default Login