import  { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { MContext }  from '../../context/MContext';

export default function Registro() {
  const [, guardarAuth] = useContext(MContext);
  let navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    email: '',
    nombre: '',
    password: '',
    direccion: '',
    contacto: ''
  });

const registrarUsuario = async (e) => {
  e.preventDefault();
  try {
    const respuesta = await clienteAxios.post('/registrar', usuario);
    console.log(respuesta.data); // <-- Agrega esto para depurar
    const { token } = respuesta.data;

    if (token) {
      localStorage.setItem('token', token);
      guardarAuth({
        token,
        auth: true,
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500); // Espera a que la alerta se muestre
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No se recibió token del servidor',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ups!!! : ' + (error.response?.data?.mensaje || 'Error inesperado'),
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

  const leerDatos = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='login'>
      <div className="contenedor-formulario m-5">
        <h2 className='h1-principal'>Registro</h2>
        <form onSubmit={registrarUsuario}>
          <div className="campo">
            <label htmlFor='email'>Email</label>
            <input
              type="email"
              name="email"
              id='email'
              placeholder="Email"
              required
              onChange={leerDatos}
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
              onChange={leerDatos}
              className='form-control'
              value={usuario.nombre}
            />
          </div>
          <div className="campo">
            <label htmlFor='password'>Password</label>
            <input
              type="password"
              name="password"
              id='password'
              placeholder="Password"
              required
              onChange={leerDatos}
              className='form-control'
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
              onChange={leerDatos}
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
              onChange={leerDatos}
              className='form-control'
              value={usuario.contacto}
            />
          </div>
          <input type="submit" value="Registrarse" className="btn btn-primary mt-3" />
        </form>
        <h4>¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a> </h4>
      </div>
    </div>
  );
}