import  { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { MContext }  from '../../context/MContext';

export default function Login() {
  const [, guardarAuth] = useContext(MContext);
  let navigate = useNavigate();
  const [credenciales, guardarCredenciales] = useState({});

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clienteAxios.post('/login', credenciales);
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
          title: 'Has iniciado sesión',
          showConfirmButton: false,
          timer: 1500,
        });

        // Redirigir después de login
        navigate('/', { replace: true });
      }
    } catch (error) {
      //console.log(error);

      if(error.response){
        Swal.fire({
          icon: 'error',
          title: 'Ups!!! : ' + error.response?.data?.mensaje || 'Error inesperado',
          showConfirmButton: false,
          timer: 1500,
        });
      }else{
        Swal.fire({
          icon: 'error',
          title:  'Error inesperado',
          showConfirmButton: false,
          timer: 1500,
        });
      }

      
    }
  };

  const leerDatos = (e) => {
    guardarCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='login'>
      <h2>Iniciar Sesión</h2>

      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label htmlFor='email' >Email</label>
            <input
              type="text"
              name="email"
              id='email'
              placeholder="Email para Iniciar Sesión"
              required
              onChange={leerDatos}
              autoComplete='email'
            />
          </div>
          <div className="campo">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id='password'
              name="password"
              placeholder="Password para Iniciar Sesión"
              required
              onChange={leerDatos}
               autoComplete="current-password"
              />
          </div>

          <input type="submit" value="Iniciar Sesión" className="btn btn-verde btn-block" />
        </form>
      </div>
    </div>
  );
}