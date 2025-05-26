import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/moradasy_db")
        console.log("conexion exitosa a mongodb")
    } catch (err) {
        console.error("Error de conexion a la DB", err)
        process.exit(1)
    }
}

export default connectDB;