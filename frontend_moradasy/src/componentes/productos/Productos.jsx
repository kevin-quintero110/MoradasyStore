import  { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Carrousel from "./Carrousel";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [ usuario, setUsuario] = useState({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const busqueda = params.get("busqueda");

  // Consulta a la API
  useEffect(() => {
    const consultarApi = async () => {
      try {
        const url = busqueda
          ? `/productos?busqueda=${encodeURIComponent(busqueda)}`
          : `/productos`;
        const productosConsulta = await clienteAxios.get(url);
        setProductos(productosConsulta.data);
      } catch (error) {
        console.error("Error al consultar el producto:", error);
      }
    };
    consultarApi();
  }, [busqueda]);

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
   <section>
    <Carrousel/>
   </section>
   
      {/* Productos */}
      <div className="container mt-4">
  <div className="row g-5">
    {productos?.length > 0 ? (
      productos.map((producto, index) => (
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
                    <b>Precio: {formatearPrecio(producto.precio)}</b>
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
                  className={` card-link btn btn-dark color-especial w-100${producto.oferta > 0 ? " mt-3" : ""}`}
                >
                  Realizar Pedido
                </a>
            </div>
          </div>
          </div>
        </div>
      ))
    ) : (
      <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center">
        <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
        <h1 className="h1-principal">No hay productos disponibles.</h1>
      </div>
    )}
  </div>
</div>
    </>
  );
}

export default Productos;
