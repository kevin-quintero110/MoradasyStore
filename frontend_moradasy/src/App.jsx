import  { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import './index.css';
import FormularioAgregar from "./componentes/admin/FormularioAgregar";
import FormularioEditar from "./componentes/admin/FormularioEditar";
import Productos from "./componentes/productos/Productos";
import Header from "./componentes/layout/Header";
import Ofertas from "./componentes/productos/Ofertas";
import Producto from "./componentes/productos/Producto";
import Carrito from "./componentes/layout/Carrito";
import Login from "./componentes/login/Login";
import Registro from "./componentes/login/Registro";
import  { MContext }  from "./context/MContext";
import RutaAdmin from "./context/RutaAdmin";
import Admin from "./componentes/admin/Admin";
import MiCuenta from "./componentes/layout/MiCuenta";


function App() {
  const [auth] = useContext(MContext);

  return (
    
    <div className={`grid contenedor contenido-principal `}>
      <Header />
      <main className={`caja-contenido `}>
        <Routes>
  {/* Ruta de autenticación e */}
  <Route path="/login" element={<Login />} />
  <Route path="/registrar" element={<Registro />} />

  {/* Rutas protegidas */}
  <Route path="/admin" element={
  <RutaAdmin>
    <Admin />
  </RutaAdmin>
} />
  <Route 
    path="/agregar/producto" 
    element={auth.auth || localStorage.getItem("token") ? <FormularioAgregar /> : <Navigate to="/login" />} 
  />
  <Route 
    path="/editar/:id" 
    element={auth.auth || localStorage.getItem("token") ? <FormularioEditar /> : <Navigate to="/login" />} 
  />
  <Route 
    path="/" 
    element={auth.auth || localStorage.getItem("token") ? <Productos /> : <Navigate to="/login" />} 
  />
    <Route 
      path="/nuevo/pedido/:id" 
      element={auth.auth || localStorage.getItem("token") ? <Producto /> : <Navigate to="/login" />} 
    />
    <Route 
      path="/carrito" 
      element={auth.auth || localStorage.getItem("token") ? <Carrito /> : <Navigate to="/login" />} 
    />
    <Route 
      path="/mi-cuenta" 
      element= {auth.auth || localStorage.getItem("token") ? <MiCuenta /> : <Navigate to="/login" />} 
    />
    {/* Rutas publicas */}
  <Route 
    path="/productos" 
    element= {<Productos/>} 
  />
  <Route 
    path="/ofertas" 
    element={<Ofertas />} 
  />

   {/* Ruta para manejar cualquier ruta no definida */}
   <Route path="*" element={<Navigate to="/login" />} />
</Routes>
      </main>
    </div>
    
    
  );
}

export default App;
