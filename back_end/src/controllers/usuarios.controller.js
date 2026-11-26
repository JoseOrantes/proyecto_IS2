const usuariosService = require('../services/usuarios.service');

async function listar(req, res) {
  res.json(await usuariosService.listar());
}

async function obtener(req, res) {
  res.json(await usuariosService.obtener(req.params.id));
}

async function crear(req, res) {
  res.status(201).json(await usuariosService.crear(req.body));
}

async function actualizar(req, res) {
  res.json(await usuariosService.actualizar(req.params.id, req.user, req.body));
}

async function eliminar(req, res) {
  await usuariosService.eliminar(req.params.id, req.user);
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
