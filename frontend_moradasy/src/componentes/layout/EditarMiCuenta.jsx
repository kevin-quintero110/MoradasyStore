import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate, useParams } from "react-router-dom";


export default function EditarMiCuenta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, guardarUsuario] = useState({
    email: "",
    nombre: "",
    direccion: "",
    contacto: "",
    password: "",
  });

  // Efecto para consultar el usuario por ID al cargar el componente
  useEffect(() => {
    const consultarApi = async () => {
      try {
       const { data } = await clienteAxios.get(`/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
        guardarUsuario({
          email: data.email || "",
          nombre: data.nombre || "",
          direccion: data.direccion || "",
          contacto: data.contacto || "",
          password: ""
        });
      } catch (error) {
        console.error("Error al consultar el usuario:", error);
      }
    };
    consultarApi();
  }, [id]);

  // Función para actualizar el estado del usuario
  const actualizarState = (e) => {
    guardarUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };


// Función para editar el usuario
  const editarUsuario = async (e) => {
    e.preventDefault();

    // Crea una copia del usuario sin el campo password si está vacío
    const datosAEnviar = { ...usuario };
    if (!datosAEnviar.password) {
      delete datosAEnviar.password;
    }

    try {
      await clienteAxios.put(`/usuarios/${id}`, datosAEnviar, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tarea Exitosa!!!",
        showConfirmButton: false,
        timer: 1500
      });

      navigate("/mi-cuenta", { replace: true });
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
  }
  
  return (
    <div className='login'>
      <div className="contenedor-login">
        <div className="text-center mb-4">
          <span
            style={{
              display: "inline-block",
              background: "#f0f0f0",
              borderRadius: "50%",
              padding: "18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <i className="bi bi-person-lines-fill" style={{ fontSize: 40, color: "#6610f2" }}></i>
            <i className="bi bi-pencil-fill" style={{ fontSize: 20, color: "#198754", marginLeft: -15, verticalAlign: "top" }}></i>
          </span>
          <h2 className='h1-principal mt-3 mb-2'>Editar mis datos</h2>
          <p className="text-muted">Actualiza tu información personal aquí</p>
        </div>
        <form onSubmit={editarUsuario} className="form-login w-100">
          <div className="campo mb-3">
            <label htmlFor='email' className="form-label">
              <i className="bi bi-envelope-fill me-2 text-primary"></i>
              Email
            </label>
            <input
              type="email"
              name="email"
              id='email'
              placeholder="Email"
              required
              onChange={actualizarState}
              autoComplete='email'
              className='form-control inputs-especiales'
              value={usuario.email}
            />
          </div>
          <div className="campo mb-3">
            <label htmlFor='nombre' className="form-label">
              <i className="bi bi-person-fill me-2 text-success"></i>
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              id='nombre'
              placeholder="Nombre"
              required
              onChange={actualizarState}
              className='form-control inputs-especiales'
              value={usuario.nombre}
            />
          </div>
          <div className="campo mb-3">
            <label htmlFor='direccion' className="form-label">
              <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              id='direccion'
              placeholder="Dirección"
              onChange={actualizarState}
              className='form-control inputs-especiales'
              value={usuario.direccion}
            />
          </div>
          <div className="campo mb-4">
            <label htmlFor='contacto' className="form-label">
              <i className="bi bi-telephone-fill me-2 text-warning"></i>
              Contacto
            </label>
            <input
              type="text"
              name="contacto"
              id='contacto'
              placeholder="Contacto"
              onChange={actualizarState}
              className='form-control inputs-especiales'
              value={usuario.contacto}
            />
          </div>

          
          <div className="mb-4 p-3 rounded" style={{ background: "#f8f9fa", border: "1px solid #e0e0e0" }}>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-shield-lock-fill text-danger me-2" style={{ fontSize: 22 }}></i>
              <span className="fw-bold text-danger">Cambiar contraseña</span>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Nueva contraseña"
              onChange={actualizarState}
              className="form-control inputs-especiales"
              value={usuario.password}
            />
            <small className="text-muted ms-1">Déjala vacía si no deseas cambiarla.</small>
          </div>

          <input type="submit" value="Guardar Cambios" className="button btn-login" />
        </form>
      </div>
    </div>
  );
}