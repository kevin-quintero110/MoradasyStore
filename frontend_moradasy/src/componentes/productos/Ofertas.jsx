import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";

function Ofertas() {
  const [productosOferta, setProductosOferta] = useState([]);

  // Consulta a la API
  useEffect(() => {
    const consultarApi = async () => {
      try {
        const productosConsulta = await clienteAxios.get(`/productos`);
        setProductosOferta(productosConsulta.data);
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
      <h1 className="h1-principal">¡OFERTAS DEL DIA!</h1>

      {/* Productos */}
      <div className="productos-container">
        {productosOferta?.length > 0 ? (
          productosOferta.map((producto) => {
            if (producto.oferta === 0) return null;

            return (
              <div className="card mt-3" key={producto.id}>
                <img
                  src={`http://localhost:3000/uploads/${producto.imagen || "placeholder.jpg"}`}
                  className="card-img-top"
                  alt={producto.nombre || "Imagen no disponible"}
                />
                <div className="card-body">
                  <h5 className="c-t">{producto.nombre}</h5>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item border-0">
                      <b className="text-info">
                        Antes: {formatearPrecio(producto.precio)}
                      </b>
                  </li>
                    <li className="list-group-item border-0">
                      <b>
                        Ahora:{" "}
                        {formatearPrecio(
                          producto.precio - (producto.precio * producto.oferta) / 100
                        )}
                      </b>
                    </li>
                  <li className="list-group-item ">
                    <h3 className="oferta bg-info text-white">
                      -{producto.oferta}%
                    </h3>
                  </li>
                </ul>
                <div className="card-body">
                <a href={`/nuevo/pedido/${producto._id}`} className="card-link btn btn-dark">
                  Realizar Pedido
                </a>
                </div>
              </div>
            );
          })
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

export default Ofertas;
