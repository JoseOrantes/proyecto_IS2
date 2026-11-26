const prospectosService = require('../services/prospectos.service');

async function listar(req, res) {
  res.json(await prospectosService.listar(req.user));
}

async function obtener(req, res) {
  res.json(await prospectosService.obtener(req.params.id, req.user));
}

async function crear(req, res) {
  res.status(201).json(await prospectosService.crear(req.body, req.user));
}

async function actualizar(req, res) {
  res.json(await prospectosService.actualizar(req.params.id, req.body, req.user));
}

async function convertir(req, res) {
  res.status(201).json(await prospectosService.convertirACliente(req.params.id, req.body, req.user));
}

async function eliminar(req, res) {
  await prospectosService.eliminar(req.params.id);
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, convertir, eliminar };
