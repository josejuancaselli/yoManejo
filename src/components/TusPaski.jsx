import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js"; // tu configuración de Firebase

const TusPaski = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [diasDelMes, setDiasDelMes] = useState([]);
  const [horarios, setHorarios] = useState([]);

  // Generar días del mes y horarios
  useEffect(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

    const dias = [];
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(new Date(anioActual, mesActual, i));
    }
    setDiasDelMes(dias);

    const horariosDisponibles = [];
    for (let h = 8; h <= 18; h++) {
      const horaFormateada = h < 10 ? `0${h}:00` : `${h}:00`;
      horariosDisponibles.push(horaFormateada);
    }
    setHorarios(horariosDisponibles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !edad || !fechaSeleccionada || !horaSeleccionada) {
      alert("Completa todos los campos");
      return;
    }

    const turno = `${fechaSeleccionada.toLocaleDateString()} ${horaSeleccionada}`;
    const docRef = doc(db, "alumnos", nombre); // usamos el nombre como id

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Si ya existe la persona, agregamos el turno al array
        await updateDoc(docRef, {
          turnos: arrayUnion(turno),
        });
      } else {
        // Si no existe, creamos el documento con el primer turno
        await setDoc(docRef, {
          nombre,
          edad,
          turnos: [turno],
        });
      }

      alert("Turno guardado correctamente");
      setNombre("");
      setEdad("");
      setFechaSeleccionada(null);
      setHoraSeleccionada("");
    } catch (error) {
      console.error("Error guardando turno:", error);
      alert("Hubo un error al guardar el turno");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Formulario de Turnos</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Edad:</label>
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Selecciona día:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "5px" }}>
            {diasDelMes.map((dia) => (
              <button
                type="button"
                key={dia.toDateString()}
                onClick={() => setFechaSeleccionada(dia)}
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    fechaSeleccionada?.toDateString() === dia.toDateString()
                      ? "#4caf50"
                      : "#e0e0e0",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {dia.getDate()}
              </button>
            ))}
          </div>
        </div>
        {fechaSeleccionada && (
          <div style={{ marginTop: "10px" }}>
            <label>Selecciona hora:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "5px" }}>
              {horarios.map((hora) => (
                <button
                  type="button"
                  key={hora}
                  onClick={() => setHoraSeleccionada(hora)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: horaSeleccionada === hora ? "#4caf50" : "#e0e0e0",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {hora}
                </button>
              ))}
            </div>
          </div>
        )}
        <button type="submit" style={{ marginTop: "15px", padding: "10px 20px" }}>
          Guardar Turno
        </button>
      </form>
    </div>
  );
};

export default TusPaski;
