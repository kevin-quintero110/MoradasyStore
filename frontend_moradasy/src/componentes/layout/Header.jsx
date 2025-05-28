import  { useContext } from 'react';
import { MContext } from '../../context/MContext'; // ✅ Usa llaves porque es un export nombrado
import PropTypes from 'prop-types';
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';

const Header = () => {

  let navigate = useNavigate();
  const [auth, guardarAuth] = useContext(MContext);

  const cerrarSesion = () => {
    guardarAuth({
      token: '',
      auth: false,
    });

    localStorage.setItem('token', '');

    // Redireccionar
    navigate('/login', { replace: true });
  };
  return (
    <nav className="navbar navbar-expand-lg color-especial">
      <div className="container-fluid">
        {/* Botón de navegación para dispositivos móvilees */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Logo de la marca */}
        <a className="navbar-brand" href="/productos">
          <img src={logo} alt="logo" className="logo" />
        </a>

        {/* Sección colapsable del navbar */}
        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/productos">
                Productos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/ofertas">
                Ofertas
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/mi-cuenta">
                My Account
              </a>
            </li>

            <li className="nav-item d-flex align-items-center">
              <i className="bi bi-circle-half mx-2 iconos-especiales" >
                {/* Aquí no necesitas el condicional, solo el ícono */}
              </i>
            </li>
            {/* Ícono de carrito */}
            <li className="nav-item d-flex align-items-center">
              <a href="/carrito">
              <i className="bi bi-cart-fill mx-2 iconos-especiales"></i>
              </a>
            </li>
          </ul>

          {/* Barra de búsqueda */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              aria-label="Search"
            />
            <button className="btn btn-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Enlace de salir */}
          {/* Mostrar el botón de logout solo si el usuario está autenticado */}
            {auth.auth && (
              <a className="nav-link mx-2" href="#" onClick={cerrarSesion}>
                Exit
              </a>
            )}
        </div>
      </div>
    </nav>
  );
};

Header.propTypes = {
  setModo: PropTypes.func.isRequired
};

export default Header;
