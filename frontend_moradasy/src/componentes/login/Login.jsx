import  { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { MContext }  from '../../context/MContext';
import { jwtDecode } from 'jwt-decode';

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
        const rol = jwtDecode(token).rol;
        guardarAuth({
          token,
          auth: true,
          rol
        });

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Has iniciado sesión',
          showConfirmButton: false,
          timer: 1500,
        });

        // Redirigir después de login
        // Redirigir según el rol
        setTimeout(() => {
          if (rol === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1500);
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

      <div className="contenedor-login">
              <h2 className='h1-principal mb-5'>Ingresa a Moradasy Store</h2>
        <form onSubmit={iniciarSesion}>
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
            />
          </div>
          
          <div className="campo form-group row">
            <div className="">
              <input type="password" className=" mb-3 inputs-especiales" id="password" name="password" placeholder="Password" onChange={leerDatos}/>
            </div>
          </div>

          <input type="submit" value="Iniciar Sesión" className="button btn-login" />
          
       
        </form>
        <h6>¿no tienes una cuenta? <a href="registrar" className='a'>Registrate</a> </h6>
        
      </div>
   
     


     </div>
  );
}