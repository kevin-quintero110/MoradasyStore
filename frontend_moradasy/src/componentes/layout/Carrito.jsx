import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { jwtDecode } from "jwt-decode";


function Carrito() {
  const [detalles, setDetalles] = useState([]); // Productos en el carrito
  const [productos, setProductos] = useState([]); // Detalles de cada producto
  const [subtotal, setSubtotal] = useState(0); // Subtotal de todos los productos
  const [ usuario, setUsuario] = useState("");


  // Obtener los IDs de los productos en el carrito
  useEffect(() => {
    const consultarCarrito = async () => {
      try {
        const respuesta = await clienteAxios.get(`/carrito`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // console.log("Respuesta del carrito:", respuesta.data);
        setDetalles(
          respuesta.data.length > 0 ? respuesta.data[0].productos : []
        );
      } catch (error) {
        console.error("Error al consultar el carrito:", error);
      }
    };
    consultarCarrito();
  }, []);

  // Obtener detalles de cada producto por ID
  useEffect(() => {
    const consultarProductos = async () => {
      try {
        const detallesProductos = await Promise.all(
          detalles.map(async (detalle) => {
            const respuesta = await clienteAxios.get(
              `/productos/${detalle.idProducto}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            // console.log("Producto Detalle:", { ...respuesta.data, ...detalle }); 
            return { ...respuesta.data, ...detalle }; 
          })
        );
        setProductos(detallesProductos);
      } catch (error) {
        console.error("Error al consultar los detalles del producto:", error);
      }
    };

    if (detalles.length > 0) {
      consultarProductos();
    }
  }, [detalles]);

  // Función para formatear precios
  const formatearPrecio = (precio) => {
    return precio.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  // Calcular subtotal
  useEffect(() => {
    const calcularSubtotal = () => {
      let total = 0;
      productos.forEach((producto) => {
        const precioFinal = !producto.oferta
          ? producto.precio * producto.cantidadProducto
          : (producto.precio - (producto.precio * producto.oferta) / 100) *
            producto.cantidadProducto;
        total += precioFinal;
      });
      setSubtotal(total);
    };

    if (productos.length > 0) {
      calcularSubtotal();
    }
  }, [productos]);

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = async (idDetalle) => {
    idDetalle = (idDetalle || "").trim();
    try {
      await clienteAxios.delete(`/carrito/${usuario}/${idDetalle}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProductos(productos.filter((producto) => producto._id !== idDetalle));
      setDetalles(detalles.filter((detalle) => detalle._id !== idDetalle));
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    }
  };

  // Función para manejar el pago con ePayco
  const handlePagar = () => {
    const handler = window.ePayco.checkout.configure({
      key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY, // Usar la variable de entorno
      test: true, // Cambia a false en producción
    });

    const data = {
      // Obligatorios
      name: "Compra en Moradasy",
      description: "Pago de productos en carrito",
      invoice: "ORD-" + Date.now(),
      amount: subtotal.toFixed(0), // Monto total en COP
      currency: "cop",
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "es",

      // Opcionales
      external: "false",
      response: "https://tusitio.com/respuesta-epayco", // URL de respuesta
      confirmation: "https://tusitio.com/confirmacion-epayco", // URL de confirmación
      email_billing: "cliente@correo.com", 
    };

    handler.open(data);
  };


  // Decodificar el token para obtener el ID del usuario
  useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const datos = jwtDecode(token);
            setUsuario(datos.id);
          } catch (err) {
            console.log("Error decodificando token:", err);
          }
        }
      }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center h1-principal">
        <i className="bi bi-cart-check-fill me-2 text-primary"></i>
        Carrito de compras
      </h2>
      {productos?.length > 0 ? (
        <>
          <div className="row g-4">
            {productos.map((producto, index) => (
              <div className="col-12" key={index}>
                <div className="card flex-row align-items-center shadow-lg p-3">
                  <div className="d-flex align-items-center" style={{ minWidth: 120 }}>
                    <img
                      src={`http://localhost:3000/uploads/${producto.imagen}`}
                      alt={producto.nombre}
                      className="rounded"
                      style={{ width: "100px", height: "100px", objectFit: "cover", border: "3px solid #6610f2" }}
                    />
                  </div>
                  <div className="flex-grow-1 ms-4">
                    <h5 className="mb-1 fw-bold text-dark">{producto.nombre}</h5>
                    <div className="mb-1">
                      <span className="badge bg-secondary me-2">
                        Talla: {producto.talla}
                      </span>
                      <span className="badge bg-info text-dark me-2">
                        Color: {producto.color}
                      </span>
                      <span className="badge bg-warning text-dark">
                        Cantidad: {producto.cantidadProducto}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="text-muted small">Ref: {producto._id}</span>
                    </div>
                    <div>
                      <span className="fw-bold text-success me-3">
                        {formatearPrecio(
                          !producto.oferta
                            ? producto.precio * producto.cantidadProducto
                            : (producto.precio - (producto.precio * producto.oferta) / 100) *
                              producto.cantidadProducto
                        )}
                      </span>
                      {producto.oferta > 0 && (
                        <span className="badge bg-danger ms-2">
                          -{producto.oferta}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-center ms-auto">
                    <button
                      className="btn btn-outline-danger btn-sm mb-2"
                      onClick={() => {
                        const idLimpio = (producto._id || "").trim();
                        eliminarDelCarrito(idLimpio);
                      }}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                    <span className="badge bg-light text-dark">
                      Unitario:{" "}
                      {formatearPrecio(
                        !producto.oferta
                          ? producto.precio
                          : (producto.precio - (producto.precio * producto.oferta) / 100)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Subtotal y botón de pagar */}
          <div className="card shadow-lg mt-5 p-4 mx-auto" style={{ maxWidth: 500 }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <h3 className="mb-0 text-primary">
                <i className="bi bi-cash-coin me-2"></i>
                Total: {formatearPrecio(subtotal)}
              </h3>
              <button
                type="button"
                className="btn btn-dark btn-lg"
                onClick={handlePagar}
              >
                <i className="bi bi-credit-card-2-front-fill me-2"></i>
                Pagar
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <i className="bi bi-cart-x display-1 text-secondary mb-3"></i>
          <h1 className="h1-principal">Esta vacio el carrito de compras...</h1>
        </div>
      )}
    </div>
  );
}

export default Carrito;
