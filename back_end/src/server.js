const env = require('./config/env');
const { createApp } = require('./app');

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET no está definido en el archivo .env');
}

createApp().listen(env.port, () => {
  console.log(`API AutoVentas GT escuchando en http://localhost:${env.port}/api`);
});
