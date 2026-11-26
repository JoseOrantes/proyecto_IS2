const clientesRepo = require('../repositories/clientes.repository');
const HttpError = require('../utils/httpError');

function validarCliente({ nombre, nit }) {
  if (!nombre || !nit) {
    throw new HttpError(400, 'Nombre y NIT son obligatorios');
  }
}

async function listar() {
  return clientesRepo.findAll();
}

async function obtener(id) {
  const cliente = await clientesRepo.findById(id);
  if (!cliente) {
    throw new HttpError(404, 'Cliente no encontrado');
  }
  return cliente;
}

async function crear(datos, usuarioId) {
  validarCliente(datos);
  if (await clientesRepo.findByNit(datos.nit)) {
    throw new HttpError(409, 'Ya existe un cliente con ese NIT');
  }
  const id = await clientesRepo.create({ ...datos, createdBy: usuarioId });
  return obtener(id);
}

async function actualizar(id, datos) {
  const actual = await obtener(id);
  const combinado = { ...actual, ...datos };
  validarCliente(combinado);
  await clientesRepo.update(id, combinado);
  return obtener(id);
}

async function eliminar(id) {
  await obtener(id);
  try {
    await clientesRepo.remove(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new HttpError(409, 'No se puede eliminar: el cliente tiene cotizaciones o prospectos asociados');
    }
    throw err;
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
