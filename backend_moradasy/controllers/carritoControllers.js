import Carrito from "../models/Carrito.js";
import mongoose from "mongoose";

// Agregar o actualizar un producto al carrito
const nuevoProducto = async (req, res) => {
  
  console.log(req.body);
  const { idCliente, idProducto, nombreProducto, precioProducto, color, talla, cantidad } = req.body;


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
      // Buscar si el producto ya está en el carrito
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
      
      const nuevoCarrito = new Carrito({
        idCliente,
        productos: [nuevoProd]
      });
      console.log({
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

// Mostrar todos los productos del carrito
const mostrarProductos = async (req, res) => {
  try {
    const productos = await Carrito.find({});
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo un error al obtener los productos del carrito" });
  }
};

// Mostrar un producto del carrito por ID
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

// Eliminar un producto específico del array productos en el carrito
const borrarProducto = async (req, res) => {
  try {
    const idDetalle = req.params.idDetalle;

    const carritoActualizado = await Carrito.updateOne(
      { "productos._id": new mongoose.Types(ObjectId(idDetalle)) },
      { $pull: { productos: { _id: new mongoose.Types(ObjectId(idDetalle)) } } }
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
