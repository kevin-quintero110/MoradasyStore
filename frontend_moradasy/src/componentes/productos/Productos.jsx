import  { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Carrousel from "./Carrousel";

function Productos() {
  const [productos, setProductos] = useState([]);

  // Consulta a la API
  useEffect(() => {
    const consultarApi = async () => {
      try {
        const productosConsulta = await clienteAxios.get(`/productos`);
        setProductos(productosConsulta.data);
      } catch (error) {
        console.error("Error al consultar el producto:", error);
      }
    };
    consultarApi();
  }, []);

  const formatearPrecio = (precio) => {
    return precio.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  };

  return (
    <>
  

   <section>
    <Carrousel/>
   </section>
      {/* Productos */}
      <div className="productos-container">
        {productos?.length > 0 ? (
          productos.map((producto, index) => (
            <div className="card mt-3" key={index}>
              <img
                src={`http://localhost:3000/uploads/${producto.imagen}`}
                className="card-img-top"
                alt="foto del producto"
              />
              <div className="card-body">
                <h5 className="c-t">{producto.nombre}</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0">
                  {producto.oferta === 0 ? (
                    <b>Precio: {formatearPrecio(producto.precio)}</b>
                  ) : (
                    <b className="text-info">
                      Antes: {formatearPrecio(producto.precio)}
                    </b>
                  )}
                </li>
                {producto.oferta > 0 && (
                  <li className="list-group-item border-0">
                    <b>
                      Ahora:{" "}
                      {formatearPrecio(
                        producto.precio - (producto.precio * producto.oferta) / 100
                      )}
                    </b>
                  </li>
                )}
                <li className="list-group-item ">
                  <h3 className="oferta bg-info text-white">
                    {producto.oferta === 0 ? null : `-${producto.oferta}%`}
                  </h3>
                </li>
              </ul>
              <div className="card-body">
                <a href={`/nuevo/pedido/${producto._id}`} className="card-link btn btn-dark">
                  Realizar Pedido
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Cargando...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Productos;
