const pool = require('../config/db');

const PUBLIC_COLUMNS = 'id, nombre, email, rol, activo, created_at';

async function findAll() {
  const [rows] = await pool.execute(`SELECT ${PUBLIC_COLUMNS} FROM usuarios ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${PUBLIC_COLUMNS} FROM usuarios WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function create({ nombre, email, passwordHash, rol }) {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, passwordHash, rol]
  );
  return result.insertId;
}

async function update(id, { nombre, rol, activo }) {
  await pool.execute('UPDATE usuarios SET nombre = ?, rol = ?, activo = ? WHERE id = ?', [
    nombre,
    rol,
    activo ? 1 : 0,
    id,
  ]);
}

async function remove(id) {
  await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
}

module.exports = { findAll, findById, findByEmail, create, update, remove };
