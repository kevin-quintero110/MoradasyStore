import Usuarios from '../models/Usuarios.js';
import jwt from 'jsonwebtoken';
import bcrypt  from 'bcrypt';

const registrarUsuario = async (req, res) => {

    const usuario = new Usuarios(req.body)
    usuario.password = await bcrypt.hash(req.body.password, 12)

    try {
        await usuario.save()
        res.json({mensaje: 'Usuario creado correctamente'})
    } catch (error) {
        console.log(error)
        res.json({mensaje: 'hubo un error'})
    }
}

const autenticarUsuario = async  (req, res, next) => {
    //buscar usuario
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email});

    if(!usuario){
        await res.status(401).json({mensaje: 'ese usuario no existe'})
        next()
    }else{

        if(!bcrypt.compareSync(password, usuario.password)){
            await res.status(401).json({mensaje: 'Password Incorrecto'})
            next()
        }else{
            
            const token = jwt.sign({
                email : usuario.email,
                nombre: usuario.nombre,
                id : usuario._id
            }, 'LLAVESECRETA', {
                expiresIn : '1h'
            });

            // retornar el token
            res.json({ token });
        }

        

    }
}
// Exportar los controladores
const usuariosControllers = {
    registrarUsuario,
    autenticarUsuario
  };
  
  export default usuariosControllers;