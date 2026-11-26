const pool = require('../config/db');

async function findTipos() {
  const [rows] = await pool.execute('SELECT id, nombre FROM tipos_vehiculo ORDER BY id');
  return rows;
}

async function findAll({ tipoId } = {}) {
  const where = tipoId ? 'WHERE v.tipo_id = ?' : '';
  const params = tipoId ? [tipoId] : [];
  const [rows] = await pool.execute(
    `SELECT v.id, v.tipo_id, t.nombre AS tipo, v.marca, v.modelo, v.anio, v.precio, v.stock, v.descripcion, v.imagen
       FROM vehiculos v JOIN tipos_vehiculo t ON t.id = v.tipo_id ${where} ORDER BY v.id`,
    params
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT v.id, v.tipo_id, t.nombre AS tipo, v.marca, v.modelo, v.anio, v.precio, v.stock, v.descripcion, v.imagen
       FROM vehiculos v JOIN tipos_vehiculo t ON t.id = v.tipo_id WHERE v.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create({ tipoId, marca, modelo, anio, precio, stock, descripcion, imagen }) {
  const [result] = await pool.execute(
    `INSERT INTO vehiculos (tipo_id, marca, modelo, anio, precio, stock, descripcion, imagen)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tipoId, marca, modelo, anio, precio, stock, descripcion ?? null, imagen ?? null]
  );
  return result.insertId;
}

async function update(id, { tipoId, marca, modelo, anio, precio, stock, descripcion, imagen }) {
  await pool.execute(
    `UPDATE vehiculos SET tipo_id = ?, marca = ?, modelo = ?, anio = ?, precio = ?, stock = ?, descripcion = ?, imagen = ?
      WHERE id = ?`,
    [tipoId, marca, modelo, anio, precio, stock, descripcion ?? null, imagen ?? null, id]
  );
}

async function remove(id) {
  await pool.execute('DELETE FROM vehiculos WHERE id = ?', [id]);
}

module.exports = { findTipos, findAll, findById, create, update, remove };
