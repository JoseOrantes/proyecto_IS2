const pool = require('../config/db');

async function findAll({ vendedorId } = {}) {
  const where = vendedorId ? 'WHERE p.vendedor_id = ?' : '';
  const params = vendedorId ? [vendedorId] : [];
  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.telefono, p.email, p.fuente, p.estado, p.vendedor_id, p.cliente_id, p.created_at
       FROM prospectos p ${where} ORDER BY p.created_at DESC`,
    params
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, nombre, telefono, email, fuente, estado, vendedor_id, cliente_id, created_at
       FROM prospectos WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create({ nombre, telefono, email, fuente, vendedorId }) {
  const [result] = await pool.execute(
    'INSERT INTO prospectos (nombre, telefono, email, fuente, vendedor_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, telefono ?? null, email ?? null, fuente ?? null, vendedorId]
  );
  return result.insertId;
}

async function update(id, { nombre, telefono, email, fuente, estado }) {
  await pool.execute(
    'UPDATE prospectos SET nombre = ?, telefono = ?, email = ?, fuente = ?, estado = ? WHERE id = ?',
    [nombre, telefono ?? null, email ?? null, fuente ?? null, estado, id]
  );
}

async function marcarConvertido(id, clienteId) {
  await pool.execute("UPDATE prospectos SET estado = 'Convertido', cliente_id = ? WHERE id = ?", [
    clienteId,
    id,
  ]);
}

async function remove(id) {
  await pool.execute('DELETE FROM prospectos WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, marcarConvertido, remove };
