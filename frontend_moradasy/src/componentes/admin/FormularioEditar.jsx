import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from 'sweetalert2'

function FormularioEditar() {
  const { id } = useParams(); // Obtén el ID del producto desde la URL
  const navigate = useNavigate();

  // Estado para el producto
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
    oferta: "",
    cantidad: "",
    categoria: "",
  });

  // Estado para la imagen (archivo)
  const [archivo, guardarArchivo] = useState("");

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
  }, [id]); // `id` como dependencia

  // Actualizar el estado del producto
  const actualizarState = (e) => {
    guardarProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  // Leer la imagen seleccionada
  const leerArchivo = (e) => {
    guardarArchivo(e.target.files[0]);
  };

  // Editar el producto
  const editarProducto = async (e) => {
    e.preventDefault();

    // Crear el objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo); // Agregar imagen solo si se seleccionó
    formData.append("oferta", producto.oferta);
    formData.append("cantidad", producto.cantidad);
    formData.append("categoria", producto.categoria);

    try {
      // Hacer la petición PUT para actualizar el producto
      await clienteAxios.put(`/productos/${id}`, formData);
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tarea Exitosa!!!",
        showConfirmButton: false,
        timer: 1500
      });

      navigate("/admin", { replace: true }); // Redirigir después de la edición
    } catch (error) {
      console.error("Error al editar el producto:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 h1-principal">Editar Producto</h1>

      <form onSubmit={editarProducto} className="row justify-content-center">
        <div className="col-md-8">
          {/* Nombre */}
          <div className="form-group mb-3">
            <label>Nombre:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nombre Producto"
              name="nombre"
              value={producto.nombre}
              onChange={actualizarState}
            />
          </div>

          {/* Precio */}
          <div className="form-group mb-3">
            <label>Precio:</label>
            <input
              className="form-control"
              type="number"
              name="precio"
              min="0.00"
              step="1"
              placeholder="Precio"
              value={producto.precio}
              onChange={actualizarState}
            />
          </div>

          {/* Imagen */}
          <div className="form-group mb-3">
            <label>Imagen:</label>
            {console.log(producto.imagen)}
            <img src={`http://localhost:3000/uploads/${producto.imagen}`} alt="imagen producto"  className='imagen-icono-producto'/>
            <input
              className="form-control"
              type="file"
              name="imagen"
              onChange={leerArchivo}
            />
          </div>

          {/* Oferta */}
          <div className="form-group mb-3">
            <label>Oferta:</label>
            <input
              className="form-control"
              type="number"
              name="oferta"
              min="0.00"
              step="1"
              placeholder="Oferta"
              value={producto.oferta}
              onChange={actualizarState}
            />
          </div>

          {/* Cantidad */}
          <div className="form-group mb-3">
            <label>Cantidad:</label>
            <input
              className="form-control"
              type="number"
              name="cantidad"
              min="0.00"
              step="1"
              placeholder="Cantidad"
              value={producto.cantidad}
              onChange={actualizarState}
            />
          </div>

          {/* Categoría */}
          <div className="form-group mb-3">
            <label>Categoria:</label>
            <select
              className="form-control"
              name="categoria"
              value={producto.categoria}
              onChange={actualizarState}
            >
              <option disabled>Selecciona...</option>
              <option>camisetas</option>
              <option>pantalones</option>
              <option>zapatillas</option>
              <option>accesorios</option>
            </select>
          </div>

          {/* Botón de Submit */}
          <div className="form-group">
            <input
              className="btn btn-dark w-100"
              type="submit"
              value="Editar Producto"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioEditar;

