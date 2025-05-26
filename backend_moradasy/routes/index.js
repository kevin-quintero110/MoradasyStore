import { Router } from "express";
import Productos from "../controllers/productosControllers.js";
import Carrito from "../controllers/carritoControllers.js"; 
import usuariosController from '../controllers/usuariosController.js';
const routes = Router();

//middle para proteger las rutas
import auth from '../middlewares/auth.js';




// ----------------------------- PRODUCTOS -----------------------------

// Mantengo las rutas de productos igual que estaban
routes.get("/productos",  Productos.mostrarProductos);
routes.get("/productos/:idProducto",  Productos.mostrarProducto);
routes.post("/productos", auth, Productos.subirArchivo, Productos.nuevoProducto);
routes.put("/productos/:idProducto", auth, Productos.subirArchivo, Productos.actualizarProductos);
routes.delete("/productos/:idProducto", auth, Productos.borrarProducto);

// ----------------------------- CARRITO -----------------------------
 
routes.get("/carrito", auth, Carrito.mostrarProductos);
routes.get("/carrito/:idCarrito", auth, Carrito.mostrarProducto);
routes.post("/carrito", auth, Carrito.nuevoProducto);
routes.put("/carrito/:idCarrito", auth, Carrito.actualizarProducto);
routes.delete("/carrito/:idCarrito", auth, Carrito.borrarProducto);



//---------------------------------usuarios------------------------------
routes.post('/crear-cuenta',  usuariosController.registrarUsuario)

routes.post('/login', usuariosController.autenticarUsuario)

export default routes;
