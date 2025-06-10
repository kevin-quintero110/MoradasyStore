import Productos from "../models/Productos.js";
import multer from "multer";
import shortid from "shortid";
import path from "path";
import fs from "fs";

// Verificar si la carpeta 'uploads' existe, si no, crearla
const rutaUploads = path.resolve("uploads");
if (!fs.existsSync(rutaUploads)) {
  fs.mkdirSync(rutaUploads);
}

// Configuración de Multer
const configuracionMulter = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, rutaUploads); // Usa la ruta absoluta de la carpeta 'uploads'
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato No válido"));
    }
  },
};


const upload = multer(configuracionMulter).single("imagen");

// Subir un archivo
const subirArchivo = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      return res.json({ mensaje: error.message });
    }
    next()
  });
};

// Agregar nuevos productos
const nuevoProducto = async (req, res) => {
  const producto = new Productos(req.body);

  try {
    // Verificar si hay un archivo subido y asignar su nombre al producto
    if (req.file && req.file.filename) {
      producto.imagen = req.file.filename;
    }

    await producto.save(); // Guardar en la base de datos
    res.json({ mensaje: "Se agregó un nuevo producto", producto });
  } catch (error) {
    console.log(error);
  }
};

// Mostrar todos los productos
const mostrarProductos = async (req, res) => {
  try {
    const { busqueda } = req.query;
    let productos;
    if (busqueda) {
      productos = await Productos.find({
        nombre: { $regex: busqueda, $options: 'i' }
      });
    } else {
      productos = await Productos.find();
    }
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// Mostrar un producto
const mostrarProducto = async (req, res, next) => {
  try {
    const producto = await Productos.findById(req.params.idProducto);
    
    if(!producto){
      res.json({mensaje: 'Ese producto no existe'})
      return
    }
    
    res.json(producto);
  } catch (error) {
    console.log(error);
    
  }
};

const actualizarProductos = async (req, res, next) => {
  try {
    // construir un nuevo producto
    let nuevoProducto = req.body;

    // verificar si hay imagen nueva
    if(req.file) {
        nuevoProducto.imagen = req.file.filename
    }else{
        let productoAnterior = await Productos.findById(req.params.idProducto);
        nuevoProducto.imagen =  productoAnterior.imagen
    }
    let producto = await Productos.findOneAndUpdate({_id: req.params.idProducto}, nuevoProducto, {
            new: true
        })
    res.json(producto)
} catch (error) {
    console.log(error)
    
}
};

// Mostrar un producto
const borrarProducto = async (req, res, next) => {
  try {
    await Productos.findByIdAndDelete({_id : req.params.idProducto});
    res.json({mensaje : 'El Producto se ha eliminado'})
  } catch (error) {
    console.log(error);
    
  }
};





// Exportar los controladores
const productosControllers = {
  subirArchivo,
  nuevoProducto,
  actualizarProductos,
  mostrarProductos,
  mostrarProducto,
  borrarProducto
};

export default productosControllers;
