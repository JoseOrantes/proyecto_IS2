const clientesService = require('../services/clientes.service');

async function listar(req, res) {
  res.json(await clientesService.listar());
}

async function obtener(req, res) {
  res.json(await clientesService.obtener(req.params.id));
}

async function crear(req, res) {
  res.status(201).json(await clientesService.crear(req.body, req.user.id));
}

async function actualizar(req, res) {
  res.json(await clientesService.actualizar(req.params.id, req.body));
}

async function eliminar(req, res) {
  await clientesService.eliminar(req.params.id);
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
