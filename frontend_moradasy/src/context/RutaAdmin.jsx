import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { MContext } from '../context/MContext';

const RutaAdmin = ({ children }) => {
  const [auth] = useContext(MContext);

  if (!auth.auth || auth.rol !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

RutaAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RutaAdmin;