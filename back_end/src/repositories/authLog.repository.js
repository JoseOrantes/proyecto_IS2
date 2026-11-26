const pool = require('../config/db');

async function registrarIntento({ email, exitoso, ip }) {
  await pool.execute('INSERT INTO auth_log (email, exitoso, ip) VALUES (?, ?, ?)', [
    email,
    exitoso ? 1 : 0,
    ip ?? null,
  ]);
}

module.exports = { registrarIntento };
