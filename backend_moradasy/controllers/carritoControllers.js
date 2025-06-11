import Carrito from "../models/Carrito.js";
import mongoose from "mongoose";

// Agregar o actualizar un producto al carrito
const nuevoProducto = async (req, res) => {
  // El idCliente SIEMPRE se toma del token, no del body
  const idCliente = req.usuario.id;
  console.log("ID Cliente:", idCliente);
  console.log("Body del request:", req.body);
  const { idProducto, nombreProducto, precioProducto, color, talla, cantidad } = req.body;

  // Validación de campos obligatorios
  if (!idProducto || !color || !talla) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios para agregar el producto al carrito" });
  }

  try {
    // Buscar el carrito del usuario
    let carrito = await Carrito.findOne({ idCliente });

    // Producto a agregar/actualizar
    const nuevoProd = {
      idProducto,
      nombreProducto,
      precioProducto,
      color,
      talla,
      cantidadProducto: cantidad || 1
    };

    if (carrito) {
      const idx = carrito.productos.findIndex(
        p =>
          p.idProducto === idProducto &&
          p.color === color &&
          p.talla === talla
      );

      if (idx > -1) {
        // Si existe, suma la cantidad
        carrito.productos[idx].cantidadProducto += cantidad || 1;
      } else {
        // Si no existe, agrega el producto
        carrito.productos.push(nuevoProd);
      }

      await carrito.save();
      return res.status(200).json({ mensaje: "Producto actualizado/agregado en el carrito", carrito });
    } else {
      // Crear un nuevo carrito para el usuario
      const nuevoCarrito = new Carrito({
        idCliente,
        productos: [nuevoProd]
      });

      await nuevoCarrito.save();
      return res.status(201).json({ mensaje: "Carrito creado y producto agregado", carrito: nuevoCarrito });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error al agregar el producto al carrito" });
  }
};

// Mostrar todos los productos del carrito del usuario autenticado
const mostrarProductos = async (req, res) => {
  try {
    const idCliente = req.usuario.id;
    const carrito = await Carrito.findOne({ idCliente });
    res.json(carrito ? [carrito] : []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo un error al obtener los productos del carrito" });
  }
};

// Mostrar un producto del carrito por ID de carrito
const mostrarProducto = async (req, res) => {
  try {
    const producto = await Carrito.findById(req.params.idCarrito);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
    }

    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo un error al obtener el producto del carrito" });
  }
};

// Actualizar un producto del carrito
const actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Carrito.findByIdAndUpdate(req.params.idCarrito, req.body, {
      new: true, // Devuelve el documento actualizado
    });

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
    }

    res.json({ mensaje: "Producto actualizado en el carrito", productoActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo un error al actualizar el producto del carrito" });
  }
};

// Eliminar un producto específico del array productos en el carrito del usuario autenticado
const borrarProducto = async (req, res) => {
  try {
    const idCliente = req.params.idCliente; // string
    const idDetalle = req.params.idDetalle; // string
    console.log("idCliente:", idCliente, "idDetalle:", idDetalle);
    const carritoActualizado = await Carrito.updateOne(
      { idCliente, "productos._id": idDetalle },
      { $pull: { productos: { _id: idDetalle } } }
    );

    if (carritoActualizado.modifiedCount === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado en ningún carrito" });
    }

    res.json({ mensaje: "Producto eliminado del carrito", carrito: carritoActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo un error al eliminar el producto del carrito" });
  }
};

// Exportar los controladores
const carritoControllers = {
  nuevoProducto,
  mostrarProductos,
  mostrarProducto,
  actualizarProducto,
  borrarProducto,
};

export default carritoControllers;
