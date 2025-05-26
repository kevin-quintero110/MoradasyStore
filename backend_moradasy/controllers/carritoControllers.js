import Carrito from "../models/Carrito.js";

// Agregar o actualizar un producto al carrito
const nuevoProducto = async (req, res) => {
  const { idProducto, color, talla, cantidad } = req.body;

  try {
    // Intentar actualizar un producto existente si ya está en el carrito
    const productoExistente = await Carrito.findOneAndUpdate(
      { idProducto, color, talla },
      { $inc: { cantidad: cantidad || 1 } }, // Incrementar la cantidad
      { new: true } // Retornar el documento actualizado
    );

    if (productoExistente) {
      return res.status(200).json({
        mensaje: "Producto actualizado en el carrito",
        producto: productoExistente,
      });
    }

    // Si no existe, crear un nuevo producto
    const nuevoProductoCarrito = new Carrito({ idProducto, color, talla, cantidad });
    const productoGuardado = await nuevoProductoCarrito.save();

    res.status(201).json({
      mensaje: "Producto agregado al carrito",
      producto: productoGuardado,
    });
  } catch (error) {
    console.error(error);
    // Manejar error de índice único
    if (error.code === 11000) {
      return res.status(400).json({
        mensaje: "El producto ya está en el carrito con las mismas características",
      });
    }
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

// Eliminar un producto del carrito
const borrarProducto = async (req, res) => {
  try {
    const productoEliminado = await Carrito.findByIdAndDelete(req.params.idCarrito);

    if (!productoEliminado) {
      return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
    }

    res.json({ mensaje: "Producto eliminado del carrito", productoEliminado });
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
