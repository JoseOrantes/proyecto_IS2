const MENSAJES_ESTANDAR = {
  400: 'Solicitud inválida',
  401: 'No autorizado',
  403: 'Acceso prohibido',
  404: 'Ruta no encontrada',
  405: 'Método no permitido',
  409: 'Conflicto con el estado actual del recurso',
  500: 'Error interno del servidor',
  501: 'No implementado',
  502: 'Respuesta inválida del servidor de origen',
  503: 'Servicio no disponible',
};

function notFound(req, res) {
  res.status(404).json({ error: MENSAJES_ESTANDAR[404] });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number.isInteger(err.status) && MENSAJES_ESTANDAR[err.status] ? err.status : 500;
  if (status >= 500) {
    console.error(err);
    return res.status(status).json({ error: MENSAJES_ESTANDAR[status] });
  }
  return res.status(status).json({ error: err.message || MENSAJES_ESTANDAR[status] });
}

module.exports = { notFound, errorHandler };
