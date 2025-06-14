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
          ? producto.precio * producto.cantidad
          : (producto.precio - (producto.precio * producto.oferta) / 100) *
            producto.cantidad;
        total += precioFinal;
      });
      setSubtotal(total);
    };

    if (productos.length > 0) {
      calcularSubtotal();
    }
  }, [productos]);

  const eliminarDelCarrito = async (idDetalle) => {
    idDetalle = (idDetalle || "").trim();
    console.log("que es esto (limpio):", idDetalle);
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
      currency: "cop",
      amount: subtotal.toFixed(0), // ePayco espera string y sin decimales para COP
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "es",

      // Opcionales
      external: "false",
      response: "https://tusitio.com/respuesta-epayco", // URL de respuesta
      confirmation: "https://tusitio.com/confirmacion-epayco", // URL de confirmación
      email_billing: "cliente@correo.com", // Puedes poner el email del usuario logueado
    };

    handler.open(data);
  };


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
    <div className="productos-container">
      {productos?.length > 0 ? (
        productos.map((producto, index) => (
          <div className="card mt-3" key={index}>
            {/* Al hacer clic en el título redirige al formulario de edición usando idDetalle del carrito */}
            <h1>
              {producto.nombre} ({producto.color} {producto.cantidad} {producto._id})
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
                  : (producto.precio - (producto.precio * producto.oferta) / 100) *
                    producto.cantidad
              )}
            </p>
            <p>{producto.idProducto}</p>
            <button
              className="btn btn-danger"
              onClick={() => {
  const idLimpio = (producto._id || "").trim();
  console.log("Producto a eliminar (limpio):", idLimpio);
  eliminarDelCarrito(idLimpio);
}}
              
            >
              Eliminar
            </button>
          </div>
        ))
      ) : (
        <>
          <h1 className="text-center mt-5">
            Esta vacio el carrito de compras...
          </h1>
        </>
      )}
      {/* Mostrar subtotal y botón de pago solo si hay productos */}
      {productos?.length > 0 && (
        <div className="subtotal mt-4">
          <h3>Total: {formatearPrecio(subtotal)}</h3>
          <button
            type="button"
            className="btn btn-dark btn-block"
            onClick={handlePagar}
          >
            Pagar
          </button>
        </div>
      )}
    </div>
  );
}

export default Carrito;
