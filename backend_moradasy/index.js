import express from "express";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from "cors"

// Cargar variables de entorno
dotenv.config({ path: 'variables.env' });

// conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);

//const __dirname = process.cwd();
const app = express();
const port = 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para "uploads", debe estar ANTES de habilitar CORS
app.use('/uploads', express.static('uploads'));

app.use(cors())
// Rutas de la app
app.use(routes);


app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
  });