import { IoIosClose } from "react-icons/io";
import { FaSave } from "react-icons/fa";


const EditarAlumno = ({ editarAlumno, setModoEdicion, alumnoSeleccionado, handleEditar, }) => {

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "3px solid #54b198", paddingBottom: "10px" }}>
                <div className="editar-alumno-modal">
                    <input name="nombre" value={alumnoSeleccionado.nombre} onChange={handleEditar} />
                </div>
                <button className="turno-btn-cerrar" style={{ marginBottom: "40px" }} onClick={() => setModoEdicion(null)}><IoIosClose /></button>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="editar-alumno-modal-1">

                    <div>
                        <p>Dirección:</p>
                        <input
                            placeholder="Calle"
                            value={alumnoSeleccionado.direccion?.calle || ""}
                            onChange={(e) => handleEditar(e, null, null, "calle")}
                        />
                        <input
                            placeholder="Número"
                            value={alumnoSeleccionado.direccion?.altura || ""}
                            onChange={(e) => handleEditar(e, null, null, "altura")}
                        />
                        <input
                            placeholder="Entre calles"
                            value={alumnoSeleccionado.direccion?.entrecalles || ""}
                            onChange={(e) => handleEditar(e, null, null, "entrecalles")}
                        />
                    </div>

                    <div>
                        <p>DNI:</p>
                        <input name="dni" value={alumnoSeleccionado.dni} onChange={handleEditar} />
                    </div>

                    <div>
                        <p>Telefono:</p>
                        <input name="telefono" value={alumnoSeleccionado.telefono} onChange={handleEditar} />
                    </div>

                    <div>
                        <p>Correo:</p>
                        <input name="correo" value={alumnoSeleccionado.correo} onChange={handleEditar} />
                    </div>

                    <div>
                        <p>Observaciones:</p>
                        <textarea style={{ height: "70px" }} name="observaciones" value={alumnoSeleccionado.observaciones} onChange={handleEditar} />
                    </div>
                </div>
                <button className="turnos-btn-editar" onClick={() => { editarAlumno(alumnoSeleccionado.id); setModoEdicion(false) }}><FaSave /></button>
            </div>
        </>


    );
};

export default EditarAlumno;

