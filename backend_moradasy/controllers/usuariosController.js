import Usuarios from '../models/Usuarios.js';
import jwt from 'jsonwebtoken';
import bcrypt  from 'bcrypt';

const registrarUsuario = async (req, res) => {
    const usuario = new Usuarios(req.body);

    // Solo este email puede ser admin
    if (usuario.email === 'admin@gmail.com') {
        usuario.rol = 'admin';
    }

    usuario.password = await bcrypt.hash(req.body.password, 12);

    try {
        await usuario.save();
        const token = jwt.sign({
            email: usuario.email,
            nombre: usuario.nombre,
            id: usuario._id,
            rol: usuario.rol
        }, 'LLAVESECRETA', {
            expiresIn: '1h'
        });

        res.json({ token });
    } catch (error) {
        console.log(error)
        res.json({mensaje: 'hubo un error'})
    }
}

const autenticarUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Ese usuario no existe, regístrate.' });
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      return res.status(401).json({ mensaje: 'Password Incorrecto' });
    }

    const token = jwt.sign(
      {
        email: usuario.email,
        nombre: usuario.nombre,
        id: usuario._id,
        rol: usuario.rol,
      },
      'LLAVESECRETA',
    //   { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
    next(error);
  }
}

const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = { ...req.body };

    // Si hay password, hashearla antes de actualizar
    if (datosActualizados.password) {
        datosActualizados.password = await bcrypt.hash(datosActualizados.password, 12);
    }

    try {
        const usuario = await Usuarios.findByIdAndUpdate(
            id,
            { $set: datosActualizados },
            { new: true, runValidators: true }
        ).select('-password');

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
    }
};
// Exportar los controladores
const usuariosControllers = {
    registrarUsuario,
    autenticarUsuario,
    actualizarUsuario
  };
  
  export default usuariosControllers;