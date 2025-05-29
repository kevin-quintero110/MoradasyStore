import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";

function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado para el producto
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
    oferta: "",
    imagen: "",
  });

  // Estado para el pedido
  const [pedido, guardarPedido] = useState({
    idProducto: id,
    color: "",
    talla: "",
    cantidad: 1,
  });

  // Obtener datos del producto al cargar el componente
  useEffect(() => {
    const consultarApi = async () => {
      try {
        const { data } = await clienteAxios.get(`/productos/${id}`);
        guardarProducto(data); // Actualiza el estado con los datos del producto
      } catch (error) {
        console.error("Error al consultar el producto:", error);
      }
    };
    consultarApi();
  }, [id]);

  // Manejo de los campos del formulario
  const actualizarState = (e) => {
    guardarPedido({
      ...pedido,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar pedido al backend
  const realizarPedido = async (e) => {
    e.preventDefault();

    const data = {
      idProducto: pedido.idProducto,
      color: pedido.color,
      talla: pedido.talla,
      cantidad: parseInt(pedido.cantidad, 10),
    };

    try {
      const respuesta = await clienteAxios.post("/carrito", data,{
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: respuesta.data.msg || "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/carrito", { replace: true });
    } catch (error) {
      console.error("Error al realizar el pedido del producto:", error.response || error.message);
    }
  };

  const formatearPrecio = (precio) => {
    return precio.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  };

  const validarProducto = () => !pedido.color || !pedido.talla || pedido.cantidad <= 0;

  return (
    <>
      <section className="section-producto py-5">
        <div className="container">
          <h1 className="text-center mb-4 h1-principal">{producto.nombre}</h1>
          <div className="row">
            <div className="col-md-6">
              <div className="img text-center">
                <img
                  src={`http://localhost:3000/uploads/${producto.imagen}`}
                  alt={producto.nombre}
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="informacion-producto">
                <form
                  onSubmit={realizarPedido}
                  className="p-4 border rounded shadow-sm"
                >
                  <div className="form-group mb-3">
                    <label htmlFor="talla">Talla:</label>
                    <input
                      id="talla"
                      className="form-control"
                      type="text"
                      placeholder="Talla"
                      name="talla"
                      onChange={actualizarState}
                      value={pedido.talla}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="color">Color:</label>
                    <select
                      id="color"
                      className="form-control"
                      onChange={actualizarState}
                      value={pedido.color}
                      name="color"
                    >
                      <option value="">----Selecciona----</option>
                      <option value="original">Original</option>
                      <option value="rojo">Rojo</option>
                      <option value="verde">Verde</option>
                      <option value="negro">Negro</option>
                      <option value="azul">Azul</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="cantidad">Cantidad:</label>
                    <input
                      id="cantidad"
                      className="form-control"
                      type="number"
                      placeholder="Cantidad"
                      name="cantidad"
                      onChange={actualizarState}
                      value={pedido.cantidad}
                    />
                  </div>

                  {producto.oferta > 0 ? (
                    <h3>
                      Total:{" "}
                      {formatearPrecio(
                        (producto.precio -
                          (producto.precio * producto.oferta) / 100) *
                          pedido.cantidad
                      )}
                    </h3>
                  ) : (
                    <h3>
                      Total: {formatearPrecio(producto.precio * pedido.cantidad)}
                    </h3>
                  )}
                  <button
                    type="submit"
                    disabled={validarProducto()}
                    className="btn btn-dark btn-block"
                  >
                    Agregar al carrito
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Producto;
