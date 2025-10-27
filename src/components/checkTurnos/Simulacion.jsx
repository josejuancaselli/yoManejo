import html2canvas from "html2canvas";


const Simulacion = ({ setSimulacion, setTurnoSim, turnoSim, setVentanaReservar }) => {

    const imprimirJPG = () => {
        const element = document.querySelector(".simulacion-modal");
        if (!element) return;

        const backdrop = document.querySelector(".simulacion-modal-backdrop");
        const originalBackdropDisplay = backdrop?.style.display;
        if (backdrop) backdrop.style.display = "hidden";

        html2canvas(element, { backgroundColor: null })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg", 1.0);
                const link = document.createElement("a");
                link.href = imgData;
                link.download = "turnos.jpeg";
                link.click();
            })
            .finally(() => {
                if (backdrop && originalBackdropDisplay !== undefined) {
                    backdrop.style.display = originalBackdropDisplay;
                }
            });
    };
    return (
        <div className="simulacion-modal-backdrop">
            
            <div className="simulacion-modal">
                <button onClick={() => { setSimulacion(false); setTurnoSim([]); }} className="btn-close" aria-label="Cerrar"                >
                    ×
                </button>
                <ul className="simulacion-list">
                    {[...turnoSim]
                        .sort((a, b) => {
                            const fechaA = new Date(a.anio, a.mes, a.dia, parseInt(a.hora));
                            const fechaB = new Date(b.anio, b.mes, b.dia, parseInt(b.hora));
                            return fechaA - fechaB; // menor a mayor
                        })
                        .map((e, index) => (
                            <li key={index} className="simulacion-item" style={{ color: "#377363" }}>
                                {String(e.dia).padStart(2, "0")}/{String(e.mes + 1).padStart(2, "0")}/{e.anio} - {e.hora} hs - Zona {e.zona}
                            </li>
                        ))}
                </ul>

                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "10px" }}>
                    <button className="btn-imprimir" onClick={() => turnoSim.length === 0 ? (() => { alert("No hay turnos para simular"); setSimulacion(false); })() : imprimirJPG()}>
                        Simular
                    </button>
                    <button className="btn-imprimir" onClick={() => { setVentanaReservar(true); setSimulacion(false) }}>
                        Reservar
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Simulacion