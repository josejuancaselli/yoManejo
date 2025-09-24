

const VentanaReservado = ({ alumnos, setVentanaReservado, ventanaReservado }) => {

  return (
    <div className="ventana-reservado-backdrop" onClick={() => setVentanaReservado(false)}>
      <div className="ventana-reservado-modal" onClick={(e) => e.stopPropagation()}>
        <div>
          <p>{ventanaReservado.nombre}</p>
          <p>{ventanaReservado.direccion}</p>
        </div>
        <button onClick={() => { setVentanaReservado(false) }}>Cerrar</button>
      </div>
    </div>

  )
}

export default VentanaReservado