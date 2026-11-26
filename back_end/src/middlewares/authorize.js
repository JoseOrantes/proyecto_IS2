const HttpError = require('../utils/httpError');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return next(new HttpError(403, 'Sin permisos para esta acción'));
    }
    return next();
  };
}

module.exports = authorize;
