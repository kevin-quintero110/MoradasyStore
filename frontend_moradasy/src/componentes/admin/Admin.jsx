import { useState, useEffect } from 'react';
import clienteAxios from "../../config/axios";
import { Link } from 'react-router-dom';

function Admin() {
  const [productos, setProductos] = useState([]);

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

  const borrarProducto = async (id) => {
    try {
      await clienteAxios.delete(`/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProductos(productos.filter(producto => producto._id !== id));
    } catch (error) {
      console.error("Error al borrar el producto:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 className="h1-principal mb-0">ADMIN</h1>
        <Link to={"/agregar/producto"} className="btn btn-primary">
          Agregar
        </Link>
      </div>

      {productos?.length > 0 ? (
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Imagen</th>
                <th scope="col">Nombre</th>
                <th scope="col">Referencia</th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index}>
                  <td style={{ width: 120 }}>
                    <img
                      src={`http://localhost:3000/uploads/${producto.imagen}`}
                      alt="foto del producto"
                      className="img-fluid rounded"
                      style={{ maxHeight: "60px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td className="text-muted small">{producto._id}</td>
                  <td className="text-center">
                    <Link to={`/editar/${producto._id}`} className="btn btn-outline-primary btn-sm me-2">
                      Editar
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => borrarProducto(producto._id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-info mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>No hay productos disponibles</p>
          <Link to={"/agregar/producto"} className="btn btn-primary mt-2">
            Agregar
          </Link>
        </div>
      )}
    </div>
  );
}

export default Admin;