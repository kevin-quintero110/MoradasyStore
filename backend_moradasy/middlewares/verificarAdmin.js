import jwt from 'jsonwebtoken';

const verificarAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
  }

  try {
    const datos = jwt.verify(token, 'LLAVESECRETA');
    if (datos.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
    }
    req.usuario = datos;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};

export default verificarAdmin;