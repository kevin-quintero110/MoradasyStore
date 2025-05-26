import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MContext } from './MContext'; // ✅ Importa el contexto separado

// Crear el proveedor de contexto
export const Provider = ({ children }) => {
  const [auth, guardarAuth] = useState({
    token: localStorage.getItem('token'),
    auth: !!localStorage.getItem('token'),
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      guardarAuth({
        token: localStorage.getItem('token'),
        auth: true,
      });
    }
  }, []);

  return (
    <MContext.Provider value={[auth, guardarAuth]}>
      {children} {/* ✅ Ahora ya está separado correctamente */}
    </MContext.Provider>
  );
};

// Validación de `children` con PropTypes
Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;