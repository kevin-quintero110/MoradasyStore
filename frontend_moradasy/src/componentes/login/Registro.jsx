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


      <div className="contenedor-formulario m-5">
              <h2 className='h1-principal'>Registro</h2>
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label htmlFor='email' >Email</label>
            <input
              type="text"
              name="email"
              id='email'
              placeholder="Email"
              required
              onChange={leerDatos}
              autoComplete='email'
              className='form-control'
            />
          </div>
          
          <div className="campo form-group row">
              <label htmlFor="inputPassword" className="col-sm-8 col-form-label">Password</label>
            <div className="col-sm-23">
              <input type="password" className="form-control"  id="password" placeholder="Password" onChange={leerDatos}/>
            </div>
          </div>

          <input type="submit" value="Iniciar Sesión" className="btn btn-primary mt-3" />
        </form>
        <h4>¿no tienes una cuenta? <a href="registrar">Registrate</a> </h4>
      
      </div>
    </div>
    
  );
}