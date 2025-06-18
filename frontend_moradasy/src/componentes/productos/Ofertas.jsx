import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { jwtDecode } from "jwt-decode";

function Ofertas() {
  const [productosOferta, setProductosOferta] = useState([]);
  
  const [ usuario, setUsuario] = useState({});

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

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const datos = jwtDecode(token);
          console.log("Token decodificado:", datos); // <-- depuración
          clienteAxios.get(`/usuarios/${datos.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
              
            }
          })
          .then(res => {
            setUsuario(res.data);
          })
        } catch (err) {
          console.log("Error decodificando token:", err);
          setUsuario({});
        }
      }
    }, []);

  return (
    <>
      <h1 className="h1-principal display-3">¡OFERTAS DEL DIA!</h1>

      {/* Productos */}
      <div className="container mt-4">
  <div className="row g-5">
        {productosOferta?.length > 0 ? (
          productosOferta.map((producto, index) => {
            if (producto.oferta === 0) return null;

            return (
              <div className="col-lg-4 col-sm-6 col-md-6" key={index}>
          <div className="card h-100 p-3 shadow-lg">
            <img
              src={`http://localhost:3000/uploads/${producto.imagen}`}
              className="card-img-top"
              alt="foto del producto"
              style={{ height: "250px", objectFit: "cover" }}
            />
                <div className="card-body d-flex flex-column align-items-start">
              <h5 className="c-t h1-principal mb-1">{producto.nombre}</h5>
              <ul className="list-group list-group-flush w-100">
                <li className="list-group-item border-0 d-flex justify-content-between align-items-center">
                  {producto.oferta === 0 ? (
                    <h2 className="  ">Precio: {formatearPrecio(producto.precio)}</h2>
                  ) : (
                    <b className="text-primary">
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
              </ul>
                    {producto.oferta > 0 && (
  <p className="oferta bg-primary p-1 rounded text-white mt-1 text-center w-100">
    -{producto.oferta}%
  </p>
)}
               {/* Botón siempre al fondo y ocupa todo el ancho */}
              <div className="mt-auto w-100">
                <a
                  href={`/nuevo/pedido/${producto._id}/${usuario._id}`}
                  className={`card-link btn-especial${producto.oferta > 0 ? " mt-3" : ""}`}
                >
                  REALIZAR PEDIDO
                </a>
                </div>
              </div>
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
      </div>
    </>
  );
}

export default Ofertas;
