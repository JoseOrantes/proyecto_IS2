require('dotenv').config();

const env = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'autoventas_gt',
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:8080')
    .split(',')
    .map((origin) => origin.trim()),
  descuentoAprobacionPct: Number(process.env.DESCUENTO_APROBACION_PCT) || 10,
};

module.exports = env;
