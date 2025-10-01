

const VentanaReservado = ({ alumnos, setVentanaReservado, ventanaReservado }) => {

  return (

    <div className="ventana-reservado-modal" onClick={(e) => e.stopPropagation()}>
      <p>{ventanaReservado.direccion}</p>
    </div>

  )
}

export default VentanaReservado