const bcrypt = require('bcrypt');
const env = require('../config/env');
const usuariosRepo = require('../repositories/usuarios.repository');
const HttpError = require('../utils/httpError');
const { ROLE_LIST } = require('../constants/roles');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validarUsuario({ nombre, email, rol }) {
  if (!nombre || !email) {
    throw new HttpError(400, 'Nombre y correo son obligatorios');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new HttpError(400, 'Correo electrónico inválido');
  }
  if (!ROLE_LIST.includes(rol)) {
    throw new HttpError(400, 'Rol inválido. Use Admin, Gerente o Vendedor');
  }
}

async function listar() {
  return usuariosRepo.findAll();
}

async function obtener(id) {
  const usuario = await usuariosRepo.findById(id);
  if (!usuario) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  return usuario;
}

async function crear({ nombre, email, password, rol }) {
  validarUsuario({ nombre, email, rol });
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }
  if (await usuariosRepo.findByEmail(email)) {
    throw new HttpError(409, 'Ya existe un usuario con ese correo');
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  const id = await usuariosRepo.create({ nombre, email, passwordHash, rol });
  return obtener(id);
}

async function actualizar(id, solicitante, { nombre, rol, activo }) {
  const actual = await obtener(id);
  const datos = {
    nombre: nombre ?? actual.nombre,
    rol: rol ?? actual.rol,
    activo: activo ?? Boolean(actual.activo),
  };

  if (!datos.nombre) {
    throw new HttpError(400, 'El nombre no puede estar vacío');
  }
  if (!ROLE_LIST.includes(datos.rol)) {
    throw new HttpError(400, 'Rol inválido. Use Admin, Gerente o Vendedor');
  }
  if (Number(id) === solicitante.id && (!datos.activo || datos.rol !== 'Admin')) {
    throw new HttpError(400, 'No puede desactivarse ni quitarse el rol Admin a sí mismo');
  }

  await usuariosRepo.update(id, datos);
  return obtener(id);
}

async function eliminar(id, solicitante) {
  await obtener(id);
  if (Number(id) === solicitante.id) {
    throw new HttpError(400, 'No puede eliminar su propio usuario');
  }
  try {
    await usuariosRepo.remove(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new HttpError(409, 'No se puede eliminar: el usuario tiene registros asociados. Desactívelo en su lugar');
    }
    throw err;
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
