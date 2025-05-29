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

  const actualizarState = (e) => {
    guardarUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };



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
      <div className="contenedor-formulario m-5">
        <h2 className='h1-principal'>Editar mis datos</h2>
        <form onSubmit={editarUsuario}>
          <div className="campo">
            <label htmlFor='email'>Email</label>
            <input
              type="email"
              name="email"
              id='email'
              placeholder="Email"
              required
              onChange={actualizarState}
              autoComplete='email'
              className='form-control'
              value={usuario.email}
            />
          </div>
          <div className="campo">
            <label htmlFor='nombre'>Nombre</label>
            <input
              type="text"
              name="nombre"
              id='nombre'
              placeholder="Nombre"
              required
              onChange={actualizarState}
              className='form-control'
              value={usuario.nombre}
            />
          </div>
          <div className="campo">
            <label htmlFor='password'>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={actualizarState}
              className="form-control"
              value={usuario.password}
            />
          </div>
          <div className="campo">
            <label htmlFor='direccion'>Dirección</label>
            <input
              type="text"
              name="direccion"
              id='direccion'
              placeholder="Dirección"
              onChange={actualizarState}
              className='form-control'
              value={usuario.direccion}
            />
          </div>
          <div className="campo">
            <label htmlFor='contacto'>Contacto</label>
            <input
              type="text"
              name="contacto"
              id='contacto'
              placeholder="Contacto"
              onChange={actualizarState}
              className='form-control'
              value={usuario.contacto}
            />
          </div>
          <input type="submit" value="Registrarse" className="btn btn-primary mt-3" />
        </form>
      </div>
    </div>
  );
}