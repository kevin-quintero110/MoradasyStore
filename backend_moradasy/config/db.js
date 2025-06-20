import mongoose from "mongoose"
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: 'variables.env' });
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("conexion exitosa a mongodb")
    } catch (err) {
        console.error("Error de conexion a la DB", err)
        process.exit(1)
    }
}

export default connectDB;