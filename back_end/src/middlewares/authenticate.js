const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const HttpError = require('../utils/httpError');

function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Token requerido'));
  }

  try {
    const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    req.user = { id: payload.sub, email: payload.email, rol: payload.rol };
    return next();
  } catch {
    return next(new HttpError(401, 'Token inválido o expirado'));
  }
}

module.exports = authenticate;
