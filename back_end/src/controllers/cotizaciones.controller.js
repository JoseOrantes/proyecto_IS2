const cotizacionesService = require('../services/cotizaciones.service');

async function listar(req, res) {
  res.json(await cotizacionesService.listar(req.user));
}

async function obtener(req, res) {
  res.json(await cotizacionesService.obtener(req.params.id, req.user));
}

async function crear(req, res) {
  res.status(201).json(await cotizacionesService.crear(req.body, req.user));
}

async function aprobar(req, res) {
  res.json(await cotizacionesService.aprobar(req.params.id, req.user));
}

async function actualizar(req, res) {
  res.json(await cotizacionesService.actualizar(req.params.id, req.body));
}

async function eliminar(req, res) {
  await cotizacionesService.eliminar(req.params.id);
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, aprobar, eliminar };
