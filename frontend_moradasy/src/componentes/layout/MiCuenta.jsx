import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import clienteAxios from "../../config/axios";

function MiCuenta() {
  const [usuario, setUsuario] = useState({});

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
    <div>
      <h2>Mi Cuenta</h2>
      {usuario.email ? (
        <ul>
          <li><strong>Email:</strong> {usuario.email}</li>
          <li><strong>Nombre:</strong> {usuario.nombre}</li>
          <li><strong>Dirección:</strong> {usuario.direccion}</li>
          <li><strong>Contacto:</strong> {usuario.contacto}</li>
          <li><strong>Rol:</strong> {usuario.rol}</li>
        </ul>
      ) : (
        <p>No hay datos de usuario.</p>
      )}
    </div>
  );
}

export default MiCuenta;