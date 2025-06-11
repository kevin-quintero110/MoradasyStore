import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  idProducto: { type: String, required: true },
  nombreProducto: { type: String, required: true },
  precioProducto: { type: Number, required: true },
  cantidadProducto: { type: Number, required: true },
  color: { type: String, required: true },
  talla: { type: String, required: true },
});

const carritoSchema = new Schema({
  idCliente: { type: String, required: true },
  productos: [productoSchema]
});

// Índice único para evitar que un usuario tenga más de un carrito
carritoSchema.index({ idCliente: 1 }, { unique: true });

const Carrito = mongoose.model("Carrito", carritoSchema);

export default Carrito;
