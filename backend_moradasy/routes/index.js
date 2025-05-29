import { Router } from "express";
import Productos from "../controllers/productosControllers.js";
import Carrito from "../controllers/carritoControllers.js"; 
import usuariosController from '../controllers/usuariosController.js';
import Usuarios from '../models/Usuarios.js'; // Asegúrate de que la ruta sea correcta
const routes = Router();

//middle para proteger las rutas
import auth from '../middlewares/auth.js';
import verificarAdmin from '../middlewares/verificarAdmin.js';




// ----------------------------- PRODUCTOS -----------------------------

// Mantengo las rutas de productos igual que estaban
routes.get("/productos",  Productos.mostrarProductos);
routes.get("/productos/:idProducto",  Productos.mostrarProducto);
routes.post("/productos", verificarAdmin, Productos.subirArchivo, Productos.nuevoProducto);
routes.put("/productos/:idProducto", verificarAdmin, Productos.subirArchivo, Productos.actualizarProductos);
routes.delete("/productos/:idProducto", verificarAdmin, Productos.borrarProducto);

// ----------------------------- CARRITO -----------------------------
 
routes.get("/carrito", auth, Carrito.mostrarProductos);
routes.get("/carrito/:idCarrito", auth, Carrito.mostrarProducto);
routes.post("/carrito", auth, Carrito.nuevoProducto);
routes.put("/carrito/:idCarrito", auth, Carrito.actualizarProducto);
routes.delete("/carrito/:idCarrito", auth, Carrito.borrarProducto);



//---------------------------------usuarios------------------------------
routes.post('/registrar',  usuariosController.registrarUsuario)

routes.post('/login', usuariosController.autenticarUsuario)

routes.get('/usuarios/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
});

routes.put("/usuarios/:id", auth, usuariosController.actualizarUsuario);

export default routes;
