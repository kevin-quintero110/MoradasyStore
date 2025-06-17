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
      <div className="contenedor-login">
        <h2 className='h1-principal mb-5'>Registro</h2>
        <form onSubmit={registrarUsuario}>
          <div className="campo">
            <input
              type="email"
              name="email"
              id='email'
              placeholder="Email"
              required
              onChange={leerDatos}
              autoComplete='email'
              className=' mb-3 inputs-especiales'
              value={usuario.email}
            />
          </div>
          <div className="campo">
            <input
              type="text"
              name="nombre"
              id='nombre'
              placeholder="Nombre"
              required
              onChange={leerDatos}
              className='mb-3 inputs-especiales'
              value={usuario.nombre}
            />
          </div>
          <div className="campo">
            
            <input
              type="password"
              name="password"
              id='password'
              placeholder="Password"
              required
              onChange={leerDatos}
              className='mb-3 inputs-especiales'
              value={usuario.password}
            />
          </div>
          <div className="campo">
            <input
              type="text"
              name="direccion"
              id='direccion'
              placeholder="Dirección"
              onChange={leerDatos}
              className='mb-3 inputs-especiales'
              value={usuario.direccion}
            />
          </div>
          <div className="campo">
            <input
              type="text"
              name="contacto"
              id='contacto'
              placeholder="Contacto"
              onChange={leerDatos}
              className='mb-3 inputs-especiales'
              value={usuario.contacto}
            />
          </div>
          <input type="submit" value="Registrarse" className="button btn-login" />
        </form>
        <h6>¿Ya tienes una cuenta? <a href="/login" className='a'>Inicia Sesión</a> </h6>
      </div>
    </div>
  );
}