import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const datos = jwt.verify(token, 'LLAVESECRETA');
    if (!datos || !datos.id) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
    req.usuario = datos;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token no válido' });
  }
};

export default auth;