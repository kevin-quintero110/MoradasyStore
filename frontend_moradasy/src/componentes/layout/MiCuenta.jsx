import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import clienteAxios from "../../config/axios";

function MiCuenta() {
  const [usuario, setUsuario] = useState({});

  // Efecto para obtener los datos del usuario al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const datos = jwtDecode(token);
        // console.log("Token decodificado:", datos); // <-- depuración
        clienteAxios.get(`/usuarios/${datos.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
            
          }
        })
        .then(res => {
          setUsuario(res.data);
        })
        .catch((err) => {
          console.log("Error backend:", err);
          setUsuario({});
        });
      } catch (err) {
        console.log("Error decodificando token:", err);
        setUsuario({});
      }
    }
  }, []);

  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: 450, width: "100%" }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle" style={{ fontSize: 70, color: "#6610f2" }}></i>
          <h2 className="h1-principal mt-2 mb-0">Mi Cuenta</h2>
          <hr />
        </div>
        {usuario.email ? (
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">
              <i className="bi bi-envelope-fill me-2 text-primary"></i>
              <strong>Email:</strong> {usuario.email}
            </li>
            <li className="list-group-item">
              <i className="bi bi-person-fill me-2 text-success"></i>
              <strong>Nombre:</strong> {usuario.nombre}
            </li>
            <li className="list-group-item">
              <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
              <strong>Dirección:</strong> {usuario.direccion}
            </li>
            <li className="list-group-item">
              <i className="bi bi-telephone-fill me-2 text-warning"></i>
              <strong>Contacto:</strong> {usuario.contacto}
            </li>
          </ul>
        ) : (
          <div className="alert alert-warning text-center">
            No hay datos de usuario.
          </div>
        )}

        <div className="d-flex justify-content-center mb-3">
          <a
            href={`/EditarMiCuenta/${usuario._id}`}
            className="btn btn-primary w-100"
          >
            <i className="bi bi-pencil-square me-2"></i>
            Editar datos
          </a>
        </div>
      </div>

      <div className="card shadow mt-4" style={{ maxWidth: 450, width: "100%" }}>
        <div className="card-body text-center">
          <h4 className="mb-3">
            <i className="bi bi-bag-check-fill text-info me-2"></i>
            Pedidos Realizados
          </h4>
          <p className="text-muted">Próximamente verás aquí tus pedidos realizados.</p>
        </div>
      </div>
    </div>
  );
}

export default MiCuenta;