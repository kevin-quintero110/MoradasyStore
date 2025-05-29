import { useState, useEffect } from "react";

import clienteAxios from "../../config/axios";

function Carrito() {
  const [detalles, setDetalles] = useState([]); // Productos en el carrito
  const [productos, setProductos] = useState([]); // Detalles de cada producto
  const [subtotal, setSubtotal] = useState(0); // Subtotal de todos los productos


  // Obtener los IDs de los productos en el carrito
  useEffect(() => {
    const consultarCarrito = async () => {
      try {
        const respuesta = await clienteAxios.get(`/carrito`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDetalles(respuesta.data);
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
            const respuesta = await clienteAxios.get(`/productos/${detalle.idProducto}`,{
                headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
            });
            console.log("Producto Detalle:", { ...respuesta.data, ...detalle }); // Depuración de la respuesta
            return { ...respuesta.data, ...detalle }; // Combina los detalles del producto con los detalles del carrito
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
    return precio.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  };

  // Calcular subtotal
  useEffect(() => {
    const calcularSubtotal = () => {
      let total = 0;
      productos.forEach((producto) => {
        const precioFinal = !producto.oferta
          ? producto.precio * producto.cantidad
          : (producto.precio - (producto.precio * producto.oferta) / 100) * producto.cantidad;
        total += precioFinal;
      });
      setSubtotal(total);
    };

    if (productos.length > 0) {
      calcularSubtotal();
    }
  }, [productos]);

  

  return (
    <div className="productos-container">
      {productos?.length > 0 ? (
        productos.map((producto, index) => (
          <div className="card mt-3" key={index}>
            {/* Al hacer clic en el título redirige al formulario de edición usando idDetalle del carrito */}
            <h1
            >
              {producto.nombre}  ({producto.color} {producto.cantidad})
            </h1>

            <img
              src={`http://localhost:3000/uploads/${producto.imagen}`}
              alt={producto.nombre}
              style={{ width: "100px", height: "100px" }}
            />
            <p>Talla: {producto.talla}</p>
            <p>
              {formatearPrecio(
                !producto.oferta
                  ? producto.precio * producto.cantidad
                  : (producto.precio - (producto.precio * producto.oferta) / 100) * producto.cantidad
              )}
            </p>
            <p>{producto.idProducto}</p>
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
      <div className="subtotal">
        <h3>Total: {formatearPrecio(subtotal)}</h3>
        <button type="submit" className="btn btn-dark btn-block">
          Pagar
        </button>
      </div>
    </div>
  );
}

export default Carrito;
