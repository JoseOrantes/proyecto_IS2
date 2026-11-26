const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const usuariosRepo = require('../repositories/usuarios.repository');
const authLogRepo = require('../repositories/authLog.repository');
const HttpError = require('../utils/httpError');

const DUMMY_HASH = bcrypt.hashSync('contrasena-no-valida', env.bcryptRounds);

async function login({ email, password, ip }) {
  if (!email || !password) {
    throw new HttpError(400, 'Correo y contraseña son obligatorios');
  }

  const usuario = await usuariosRepo.findByEmail(email);
  const passwordValida = await bcrypt.compare(password, usuario ? usuario.password_hash : DUMMY_HASH);
  const autenticado = Boolean(usuario && usuario.activo && passwordValida);

  await authLogRepo.registrarIntento({ email, exitoso: autenticado, ip });

  if (!autenticado) {
    throw new HttpError(401, 'Credenciales inválidas');
  }

  const token = jwt.sign(
    { sub: usuario.id, email: usuario.email, rol: usuario.rol },
    env.jwtSecret,
    { algorithm: 'HS256', expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  };
}

module.exports = { login };
