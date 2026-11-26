const reportesService = require('../services/reportes.service');

async function funnel(req, res) {
  res.json(await reportesService.funnel());
}

async function ventas(req, res) {
  res.json(await reportesService.ventas());
}

module.exports = { funnel, ventas };
