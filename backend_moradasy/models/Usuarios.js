import mongoose from "mongoose";
const Schema = mongoose.Schema;


const usuariosSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: 'Agrega tu Nombre'
    },
    password: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        lowercase: true
    },
    contacto: {
        type: String,
    },
    rol: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    pedidos: [{
        type: Schema.Types.ObjectId,
        ref: 'Pedidos'
    }],
})


// Modelo de productos
const Usuarios = mongoose.model("Usuarios", usuariosSchema);

export default Usuarios;