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
  }, [productos]);

  const borrarProducto = async (id) => {
    try {
      await clienteAxios.delete(`/productos/${id}`);
      setProductos(productos.filter(producto => producto._id !== id));
    } catch (error) {
      console.error("Error al borrar el producto:", error);
    }
  };

  return (
    <>
      <div className="contenedor">
        <h1 className='h1-principal'>ADMIN</h1>
        {productos?.length > 0 ? (
          <Link to={"/agregar/producto"} className='agregar-producto' style={{ alignSelf: 'end' }}>Agregar</Link>
        ) : (
          null
        )}
      </div>

      {productos?.length > 0 ? (
        productos.map((producto, index) => (
          <div key={index} className='producto-admin'>
            <img src={`http://localhost:3000/uploads/${producto.imagen}`} alt="foto del producto" className='imagen-icono-producto' />
            <p className='producto-info'>{producto.nombre}</p>
            <p className='producto-info'>ref: {producto._id}</p>

            <div>
              <Link to={`/editar/${producto._id}`} className='editar-producto'>Editar</Link>
              <Link className='borrar-producto' onClick={() => borrarProducto(producto._id)}>Borrar</Link>
            </div>
          </div>
        ))
      ) : (
        <>
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>No hay productos disponibles</p>
          <Link to={"/agregar/producto"} className='agregar-producto' style={{ alignSelf: 'center' }}>Agregar</Link>
        </>
      )}
    </>
  );
}

export default Admin;
