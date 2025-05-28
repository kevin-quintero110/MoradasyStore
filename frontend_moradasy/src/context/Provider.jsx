import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MContext } from './MContext';
import { jwtDecode } from 'jwt-decode';

export const Provider = ({ children }) => {
  const [auth, guardarAuth] = useState(() => {
    const token = localStorage.getItem('token');
    let rol = null;
    if (token) {
      try {
        rol = jwtDecode(token).rol;
      } catch {
        // error al decodificar el token
      }
    }
    return {
      token,
      auth: !!token,
      rol,
    };
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    let rol = null;
    if (token) {
      try {
        rol = jwtDecode(token).rol;
      } catch {
        // error al decodificar el token
      }
      guardarAuth({
        token,
        auth: true,
        rol,
      });
    }
  }, []);

  return (
    <MContext.Provider value={[auth, guardarAuth]}>
      {children}
    </MContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;