import { useState } from "react";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

function FormularioAgregar() {
  let navigate = useNavigate();
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
    oferta: "",
    cantidad: "",
    categoria: "Selecciona...",
  });

  const [archivo, guardarArchivo] = useState("");

  const actualizarState = (e) => {
    guardarProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const leerArchivo = (e) => {
    guardarArchivo(e.target.files[0]);
  };

  const agregarProducto = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);
    formData.append("oferta", producto.oferta);
    formData.append("cantidad", producto.cantidad);
    formData.append("categoria", producto.categoria);

    try {
      await clienteAxios.post("/productos", formData);
       Swal.fire({
              position: "center",
              icon: "success",
              title: "Agregado Exitosamente!!!",
              showConfirmButton: false,
              timer: 1500
            });
      navigate("/admin", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const validarProducto = () => !producto.nombre || !producto.precio || !archivo;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 h1-principal">Nuevo Producto</h1>

      <form onSubmit={agregarProducto} className="row justify-content-center">
        <div className="col-md-8">
          <legend className="mb-4 text-center h1-principal" >Llena todos los campos</legend>

          <div className="form-group mb-3">
            <label>Nombre:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nombre Producto"
              name="nombre"
              onChange={actualizarState}
              value={producto.nombre}
            />
          </div>

          <div className="form-group mb-3">
            <label>Precio:</label>
            <input
              className="form-control"
              type="text"
              name="precio"
              placeholder="Precio"
              onChange={actualizarState}
              value={producto.precio}
            />
          </div>

          <div className="form-group mb-3">
            <label>Imagen:</label>
            <input
              className="form-control"
              type="file"
              name="imagen"
              onChange={leerArchivo}
            />
          </div>

          <div className="form-group mb-3">
            <label>Oferta:</label>
            <input
              className="form-control"
              type="text"
              name="oferta"
              placeholder="Oferta"
              onChange={actualizarState}
              value={producto.oferta}
            />
          </div>

          <div className="form-group mb-3">
            <label>Cantidad:</label>
            <input
              className="form-control"
              type="text"
              name="cantidad"
              placeholder="Cantidad"
              onChange={actualizarState}
              value={producto.cantidad}
            />
          </div>

          <div className="form-group mb-3">
            <label>Categoria:</label>
            <select
              className="form-control"
              onChange={actualizarState}
              value={producto.categoria}
              name="categoria"
            >
              <option disabled>Selecciona...</option>
              <option>camisetas</option>
              <option>pantalones</option>
              <option>zapatillas</option>
              <option>accesorios</option>
            </select>
          </div>

          <div className="form-group">
            <input
              className="btn btn-dark w-100"
              type="submit"
              value="Agregar Producto"
              disabled={validarProducto()}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioAgregar;
