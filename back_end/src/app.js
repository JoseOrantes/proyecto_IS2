const express = require('express');
const cors = require('cors');
const { corsOptions } = require('./config/cors');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.use(cors(corsOptions()));
  app.use(express.json());
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
