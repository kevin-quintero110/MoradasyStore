import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });

  try {
    const datos = jwt.verify(token, 'LLAVESECRETA');
    if (!datos || !datos.id) return res.status(401).json({ mensaje: 'Token inválido' });
    req.usuario = datos;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};

export default auth;