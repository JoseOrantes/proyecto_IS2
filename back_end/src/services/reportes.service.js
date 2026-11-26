const reportesRepo = require('../repositories/reportes.repository');

async function funnel() {
  const porEstado = await reportesRepo.contarProspectosPorEstado();
  const total = porEstado.reduce((suma, fila) => suma + Number(fila.cantidad), 0);
  return { total, porEstado };
}

async function ventas() {
  const porVendedor = await reportesRepo.ventasPorVendedor();
  const montoTotal = porVendedor.reduce((suma, fila) => suma + Number(fila.monto_total), 0);
  return { montoTotal, porVendedor };
}

module.exports = { funnel, ventas };
