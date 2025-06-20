import { useContext, useState } from 'react';
import { MContext } from '../../context/MContext';
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  let navigate = useNavigate();
  const [auth, guardarAuth] = useContext(MContext);
  const [busqueda, setBusqueda] = useState("");

  // Función para cerrar sesión
  const cerrarSesion = (e) => {
    e.preventDefault();
    guardarAuth({
      token: '',
      auth: false,
    });
    localStorage.setItem('token', '');
    navigate('/login', { replace: true });
  };

    // Función para manejar la búsqueda
  const handleBuscar = (e) => {
    e.preventDefault();
    navigate(`/productos?busqueda=${encodeURIComponent(busqueda)}`);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg  navbar-light bg-light">
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
          {/* Botón de navegación para móviles */}
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
          {/* Sección colapsable */}
          <div className="collapse navbar-collapse flex-grow-1" id="navbarTogglerDemo03">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
          {/* Logo */}
          <a className="navbar-brand" href="/productos">
            <img src={logo} alt="logo" className="logo" />
          </a>
              <li className="nav-item">
                <a className="nav-link" href="/productos">Productos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ofertas">Ofertas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/mi-cuenta">My Account</a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a href="/carrito">
                  <i className="bi bi-cart-check-fill iconos-especiales"></i>
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0 justify-content-center">
              <form className="d-flex form-busqueda" role="search" onSubmit={handleBuscar}>
                <input
                  className="form-control me-2"
                  type="search"
                  aria-label="Search"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
                <button className="color-especial-button" type="submit">
                  Search
                </button>
              </form>
              {auth.auth && (
                <a className="nav-link mx-2" href="#" onClick={cerrarSesion}>
                  Exit
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
