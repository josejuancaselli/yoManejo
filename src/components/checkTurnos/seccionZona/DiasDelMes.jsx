import { useState } from "react";
import BotonesHora from "./BotonesHora";

const DiasDelMes = ({ abreArriba, horarios, reservado, horariosMañana, activeHora, setActiveHora, mañanaTarde, setMañanaTarde, horariosTarde, alumnos, toggleHora, fecha, zona, dia, disabled, setVentanaDireccion, ventanaDireccion }) => {

    const [horariosVisible, setHorariosVisible] = useState(false);
    const handleMouseEnter = () => {
        if (!disabled.includes(dia)) {
            return setHorariosVisible(true);
        }
    }
    const handleMouseLeave = () => {
        return setHorariosVisible(false)
    }

    const bgrColor = () => {
        if (disabled.includes(dia)) {
            return "#a9a9a9"
        }
    }

    const pointer = () => {
        if (disabled.includes(dia)) {
            return "not-allowed"
        } else {
            return "pointer"
        }
    }

    return (
        <div className="dia-mes " onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ backgroundColor: bgrColor(), cursor: pointer() }} >

            {dia}

            {horariosVisible && mañanaTarde.length > 0 && (
                <div className={`horarios-wrapper ${abreArriba ? "arriba" : "abajo"}`}>
                    <BotonesHora
                        horarios={horarios}
                        toggleHora={toggleHora}
                        alumnos={alumnos}
                        dia={dia}
                        reservado={reservado}
                        ventanaDireccion={ventanaDireccion}
                        setVentanaDireccion={setVentanaDireccion}
                        fecha={fecha}
                        zona={zona}
                        horariosMañana={horariosMañana}
                        horariosTarde={horariosTarde}
                        activeHora={activeHora}
                        setActiveHora={setActiveHora}
                        mañanaTarde={mañanaTarde}
                        setMañanaTarde={setMañanaTarde}
                    />
                </div>
            )}

        </div>
    )
}

export default DiasDelMes