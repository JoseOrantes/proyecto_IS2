require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const env = require('../src/config/env');

const SEED_USERS = [
  { nombre: 'Administrador Demo', email: 'admin@autoventas.test', rol: 'Admin', envVar: 'ADMIN_PASSWORD' },
  { nombre: 'Gerente Demo', email: 'gerente@autoventas.test', rol: 'Gerente', envVar: 'GERENTE_PASSWORD' },
  { nombre: 'Vendedor Demo', email: 'vendedor@autoventas.test', rol: 'Vendedor', envVar: 'VENDEDOR_PASSWORD' },
];

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  const connection = await mysql.createConnection({ ...env.db, database: undefined, multipleStatements: true });

  try {
    await connection.query(schema);
    await connection.query(`USE ${env.db.database}`);

    for (const usuario of SEED_USERS) {
      const password = process.env[usuario.envVar];
      if (!password || password.length < 8) {
        throw new Error(`Defina ${usuario.envVar} en .env (mínimo 8 caracteres)`);
      }
      const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
      await connection.execute(
        `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
        [usuario.nombre, usuario.email, passwordHash, usuario.rol]
      );
    }

    console.log('Base de datos y usuarios de demostración listos.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
