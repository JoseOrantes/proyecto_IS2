const vehiculosService = require('../services/vehiculos.service');

async function listarTipos(req, res) {
  res.json(await vehiculosService.listarTipos());
}

async function listar(req, res) {
  res.json(await vehiculosService.listar({ tipoId: req.query.tipo_id }));
}

async function obtener(req, res) {
  res.json(await vehiculosService.obtener(req.params.id));
}

async function crear(req, res) {
  res.status(201).json(await vehiculosService.crear(req.body));
}

async function actualizar(req, res) {
  res.json(await vehiculosService.actualizar(req.params.id, req.body));
}

async function eliminar(req, res) {
  await vehiculosService.eliminar(req.params.id);
  res.status(204).end();
}

module.exports = { listarTipos, listar, obtener, crear, actualizar, eliminar };
