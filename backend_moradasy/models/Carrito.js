import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Esquema de carrito
const carritoSchema = new Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Producto", 
    required: true,  
  },
  color: {
    type: String,
    required: true, 
  },
  talla: {
    type: String,
    required: true, 
  },
  cantidad: {
    type: Number,
    default: 1,
    min: 1, 
  },
});

// Índice único para evitar duplicados (idProducto + color + talla)
carritoSchema.index({ idProducto: 1, color: 1, talla: 1 }, { unique: true });

// Modelo de carrito
const Carrito = mongoose.model("Carrito", carritoSchema);

export default Carrito;
