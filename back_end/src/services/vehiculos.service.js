const vehiculosRepo = require('../repositories/vehiculos.repository');
const HttpError = require('../utils/httpError');

const ANIO_MINIMO = 1900;
const ANIO_MAXIMO = 2100;

function validarVehiculo({ tipoId, marca, modelo, anio, precio, stock }) {
  if (!tipoId || !marca || !modelo) {
    throw new HttpError(400, 'Tipo, marca y modelo son obligatorios');
  }
  if (!Number.isInteger(Number(anio)) || Number(anio) < ANIO_MINIMO || Number(anio) > ANIO_MAXIMO) {
    throw new HttpError(400, 'El año no es válido');
  }
  if (!Number.isFinite(Number(precio)) || Number(precio) < 0) {
    throw new HttpError(400, 'El precio no es válido');
  }
  if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    throw new HttpError(400, 'El stock debe ser un entero mayor o igual a cero');
  }
}

async function listarTipos() {
  return vehiculosRepo.findTipos();
}

async function listar({ tipoId } = {}) {
  return vehiculosRepo.findAll({ tipoId });
}

async function obtener(id) {
  const vehiculo = await vehiculosRepo.findById(id);
  if (!vehiculo) {
    throw new HttpError(404, 'Vehículo no encontrado');
  }
  return vehiculo;
}

async function crear(datos) {
  validarVehiculo(datos);
  const id = await vehiculosRepo.create(datos);
  return obtener(id);
}

async function actualizar(id, datos) {
  const actual = await obtener(id);
  const combinado = {
    tipoId: datos.tipoId ?? actual.tipo_id,
    marca: datos.marca ?? actual.marca,
    modelo: datos.modelo ?? actual.modelo,
    anio: datos.anio ?? actual.anio,
    precio: datos.precio ?? actual.precio,
    stock: datos.stock ?? actual.stock,
    descripcion: datos.descripcion ?? actual.descripcion,
    imagen: datos.imagen ?? actual.imagen,
  };
  validarVehiculo(combinado);
  await vehiculosRepo.update(id, combinado);
  return obtener(id);
}

async function eliminar(id) {
  await obtener(id);
  try {
    await vehiculosRepo.remove(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new HttpError(409, 'No se puede eliminar: el vehículo tiene cotizaciones asociadas');
    }
    throw err;
  }
}

module.exports = { listarTipos, listar, obtener, crear, actualizar, eliminar };
