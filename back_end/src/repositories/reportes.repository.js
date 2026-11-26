const pool = require('../config/db');

async function contarProspectosPorEstado() {
  const [rows] = await pool.execute(
    'SELECT estado, COUNT(*) AS cantidad FROM prospectos GROUP BY estado ORDER BY FIELD(estado, "Nuevo", "Contactado", "Calificado", "Convertido", "Descartado")'
  );
  return rows;
}

async function ventasPorVendedor() {
  const [rows] = await pool.execute(
    `SELECT u.id AS vendedor_id, u.nombre AS vendedor, COUNT(c.id) AS cotizaciones_aprobadas,
            COALESCE(SUM(c.total), 0) AS monto_total
       FROM cotizaciones c JOIN usuarios u ON u.id = c.vendedor_id
      WHERE c.estado = 'Aprobada'
      GROUP BY u.id, u.nombre
      ORDER BY monto_total DESC`
  );
  return rows;
}

module.exports = { contarProspectosPorEstado, ventasPorVendedor };
