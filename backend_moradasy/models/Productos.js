import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Esquema de productos
const productosSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true, 
  },
  precio: {
    type: Number,
    required: true, 
  },
  imagen: {
    type: String,
  },
  oferta: {
    type: Number,
    default: 0, 
  },
  cantidad: {
    type: Number,
    default: 0, 
  },
  categoria: {
    type: String,
    enum: ["zapatillas", "camisetas", "pantalones", "accesorios"], 
    required: true, 
  },
});

// Modelo de productos
const Productos = mongoose.model("Productos", productosSchema);

export default Productos;
