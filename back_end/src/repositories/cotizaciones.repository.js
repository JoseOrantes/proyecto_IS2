const pool = require('../config/db');

const SELECT_BASE = `
  SELECT c.id, c.cliente_id, cl.nombre AS cliente, c.vendedor_id, u.nombre AS vendedor,
         c.vehiculo_id, v.modelo AS vehiculo, c.precio_lista, c.descuento_pct, c.total,
         c.estado, c.aprobado_por, c.created_at
    FROM cotizaciones c
    JOIN clientes cl ON cl.id = c.cliente_id
    JOIN usuarios u ON u.id = c.vendedor_id
    JOIN vehiculos v ON v.id = c.vehiculo_id`;

async function findAll({ vendedorId } = {}) {
  const where = vendedorId ? 'WHERE c.vendedor_id = ?' : '';
  const params = vendedorId ? [vendedorId] : [];
  const [rows] = await pool.execute(`${SELECT_BASE} ${where} ORDER BY c.created_at DESC`, params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`${SELECT_BASE} WHERE c.id = ?`, [id]);
  return rows[0] || null;
}

async function create({ clienteId, vendedorId, vehiculoId, precioLista, descuentoPct, total, estado }) {
  const [result] = await pool.execute(
    `INSERT INTO cotizaciones (cliente_id, vendedor_id, vehiculo_id, precio_lista, descuento_pct, total, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [clienteId, vendedorId, vehiculoId, precioLista, descuentoPct, total, estado]
  );
  return result.insertId;
}

async function aprobar(id, aprobadoPor) {
  await pool.execute(
    "UPDATE cotizaciones SET estado = 'Aprobada', aprobado_por = ? WHERE id = ?",
    [aprobadoPor, id]
  );
}

async function remove(id) {
  await pool.execute('DELETE FROM cotizaciones WHERE id = ?', [id]);
}

async function update(id, { clienteId, vehiculoId, precioLista, descuentoPct, total, estado, aprobadoPor }) {
  await pool.execute(
    `UPDATE cotizaciones
        SET cliente_id = ?, vehiculo_id = ?, precio_lista = ?, descuento_pct = ?, total = ?, estado = ?, aprobado_por = ?
      WHERE id = ?`,
    [clienteId, vehiculoId, precioLista, descuentoPct, total, estado, aprobadoPor ?? null, id]
  );
}

module.exports = { findAll, findById, create, update, aprobar, remove };
