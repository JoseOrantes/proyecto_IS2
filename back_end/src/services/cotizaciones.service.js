const cotizacionesRepo = require('../repositories/cotizaciones.repository');
const clientesRepo = require('../repositories/clientes.repository');
const vehiculosRepo = require('../repositories/vehiculos.repository');
const env = require('../config/env');
const HttpError = require('../utils/httpError');
const { ROLES } = require('../constants/roles');

function calcularTotal(precio, descuentoPct) {
  return Math.round(precio * (1 - descuentoPct / 100) * 100) / 100;
}

async function listar(usuario) {
  const vendedorId = usuario.rol === ROLES.VENDEDOR ? usuario.id : undefined;
  return cotizacionesRepo.findAll({ vendedorId });
}

async function obtener(id, usuario) {
  const cotizacion = await cotizacionesRepo.findById(id);
  if (!cotizacion) {
    throw new HttpError(404, 'Cotización no encontrada');
  }
  if (usuario.rol === ROLES.VENDEDOR && cotizacion.vendedor_id !== usuario.id) {
    throw new HttpError(403, 'Sin permisos para esta cotización');
  }
  return cotizacion;
}

async function crear({ clienteId, vehiculoId, descuentoPct = 0 }, usuario) {
  const descuento = Number(descuentoPct);
  if (!clienteId || !vehiculoId) {
    throw new HttpError(400, 'Cliente y vehículo son obligatorios');
  }
  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new HttpError(400, 'El descuento debe estar entre 0 y 100');
  }

  const cliente = await clientesRepo.findById(clienteId);
  if (!cliente) {
    throw new HttpError(404, 'Cliente no encontrado');
  }
  const vehiculo = await vehiculosRepo.findById(vehiculoId);
  if (!vehiculo) {
    throw new HttpError(404, 'Vehículo no encontrado');
  }
  if (vehiculo.stock < 1) {
    throw new HttpError(409, 'Vehículo sin stock disponible');
  }

  const requiereAprobacion = descuento > env.descuentoAprobacionPct;
  const id = await cotizacionesRepo.create({
    clienteId,
    vendedorId: usuario.id,
    vehiculoId,
    precioLista: vehiculo.precio,
    descuentoPct: descuento,
    total: calcularTotal(vehiculo.precio, descuento),
    estado: requiereAprobacion ? 'Pendiente' : 'Aprobada',
  });
  return obtener(id, usuario);
}

async function actualizar(id, { clienteId, vehiculoId, descuentoPct }) {
  const actual = await cotizacionesRepo.findById(id);
  if (!actual) {
    throw new HttpError(404, 'Cotización no encontrada');
  }
  const descuento = Number(descuentoPct ?? actual.descuento_pct);
  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new HttpError(400, 'El descuento debe estar entre 0 y 100');
  }

  const nuevoClienteId = clienteId ?? actual.cliente_id;
  if (!(await clientesRepo.findById(nuevoClienteId))) {
    throw new HttpError(404, 'Cliente no encontrado');
  }

  const nuevoVehiculoId = vehiculoId ?? actual.vehiculo_id;
  const vehiculo = await vehiculosRepo.findById(nuevoVehiculoId);
  if (!vehiculo) {
    throw new HttpError(404, 'Vehículo no encontrado');
  }
  if (Number(nuevoVehiculoId) !== Number(actual.vehiculo_id) && vehiculo.stock < 1) {
    throw new HttpError(409, 'Vehículo sin stock disponible');
  }

  const requiereAprobacion = descuento > env.descuentoAprobacionPct;
  const estado = requiereAprobacion ? 'Pendiente' : 'Aprobada';
  const aprobadoPor = estado === 'Aprobada' && actual.estado === 'Aprobada' ? actual.aprobado_por : null;

  await cotizacionesRepo.update(id, {
    clienteId: nuevoClienteId,
    vehiculoId: nuevoVehiculoId,
    precioLista: vehiculo.precio,
    descuentoPct: descuento,
    total: calcularTotal(vehiculo.precio, descuento),
    estado,
    aprobadoPor,
  });
  return cotizacionesRepo.findById(id);
}

async function aprobar(id, usuario) {
  const cotizacion = await cotizacionesRepo.findById(id);
  if (!cotizacion) {
    throw new HttpError(404, 'Cotización no encontrada');
  }
  if (cotizacion.estado !== 'Pendiente') {
    throw new HttpError(409, 'Solo se pueden aprobar cotizaciones pendientes');
  }
  await cotizacionesRepo.aprobar(id, usuario.id);
  return cotizacionesRepo.findById(id);
}

async function eliminar(id) {
  const cotizacion = await cotizacionesRepo.findById(id);
  if (!cotizacion) {
    throw new HttpError(404, 'Cotización no encontrada');
  }
  await cotizacionesRepo.remove(id);
}

module.exports = { listar, obtener, crear, actualizar, aprobar, eliminar };
