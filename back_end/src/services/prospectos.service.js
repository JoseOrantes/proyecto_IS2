const prospectosRepo = require('../repositories/prospectos.repository');
const clientesRepo = require('../repositories/clientes.repository');
const HttpError = require('../utils/httpError');
const { ROLES } = require('../constants/roles');

const ESTADOS = ['Nuevo', 'Contactado', 'Calificado', 'Convertido', 'Descartado'];

function puedeVerProspecto(prospecto, usuario) {
  return usuario.rol !== ROLES.VENDEDOR || prospecto.vendedor_id === usuario.id;
}

async function obtenerAutorizado(id, usuario) {
  const prospecto = await prospectosRepo.findById(id);
  if (!prospecto) {
    throw new HttpError(404, 'Prospecto no encontrado');
  }
  if (!puedeVerProspecto(prospecto, usuario)) {
    throw new HttpError(403, 'Sin permisos para este prospecto');
  }
  return prospecto;
}

async function listar(usuario) {
  const vendedorId = usuario.rol === ROLES.VENDEDOR ? usuario.id : undefined;
  return prospectosRepo.findAll({ vendedorId });
}

async function obtener(id, usuario) {
  return obtenerAutorizado(id, usuario);
}

async function crear({ nombre, telefono, email, fuente }, usuario) {
  if (!nombre) {
    throw new HttpError(400, 'El nombre es obligatorio');
  }
  const id = await prospectosRepo.create({ nombre, telefono, email, fuente, vendedorId: usuario.id });
  return prospectosRepo.findById(id);
}

async function actualizar(id, datos, usuario) {
  const actual = await obtenerAutorizado(id, usuario);
  const combinado = { ...actual, ...datos };
  if (!combinado.nombre) {
    throw new HttpError(400, 'El nombre es obligatorio');
  }
  if (!ESTADOS.includes(combinado.estado) || combinado.estado === 'Convertido') {
    throw new HttpError(400, 'Estado inválido. Para convertir use la acción de conversión');
  }
  await prospectosRepo.update(id, combinado);
  return prospectosRepo.findById(id);
}

async function convertirACliente(id, { nit }, usuario) {
  const prospecto = await obtenerAutorizado(id, usuario);
  if (prospecto.estado === 'Convertido') {
    throw new HttpError(409, 'El prospecto ya fue convertido');
  }
  if (!nit) {
    throw new HttpError(400, 'El NIT es obligatorio para crear el cliente');
  }
  if (await clientesRepo.findByNit(nit)) {
    throw new HttpError(409, 'Ya existe un cliente con ese NIT');
  }

  const clienteId = await clientesRepo.create({
    nombre: prospecto.nombre,
    nit,
    telefono: prospecto.telefono,
    email: prospecto.email,
    direccion: null,
    createdBy: usuario.id,
  });
  await prospectosRepo.marcarConvertido(id, clienteId);
  return { prospecto: await prospectosRepo.findById(id), clienteId };
}

async function eliminar(id) {
  const prospecto = await prospectosRepo.findById(id);
  if (!prospecto) {
    throw new HttpError(404, 'Prospecto no encontrado');
  }
  await prospectosRepo.remove(id);
}

module.exports = { listar, obtener, crear, actualizar, convertirACliente, eliminar };
