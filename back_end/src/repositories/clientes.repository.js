const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.execute(
    'SELECT id, nombre, nit, telefono, email, direccion, created_at FROM clientes ORDER BY nombre'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT id, nombre, nit, telefono, email, direccion, created_by, created_at FROM clientes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findByNit(nit) {
  const [rows] = await pool.execute('SELECT id FROM clientes WHERE nit = ?', [nit]);
  return rows[0] || null;
}

async function create({ nombre, nit, telefono, email, direccion, createdBy }) {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nombre, nit, telefono, email, direccion, created_by) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, nit, telefono ?? null, email ?? null, direccion ?? null, createdBy]
  );
  return result.insertId;
}

async function update(id, { nombre, telefono, email, direccion }) {
  await pool.execute(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
    [nombre, telefono ?? null, email ?? null, direccion ?? null, id]
  );
}

async function remove(id) {
  await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
}

module.exports = { findAll, findById, findByNit, create, update, remove };
