const express = require('express');
const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');
const clientesRoutes = require('./clientes.routes');
const prospectosRoutes = require('./prospectos.routes');
const vehiculosRoutes = require('./vehiculos.routes');
const cotizacionesRoutes = require('./cotizaciones.routes');
const reportesRoutes = require('./reportes.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/clientes', clientesRoutes);
router.use('/prospectos', prospectosRoutes);
router.use('/vehiculos', vehiculosRoutes);
router.use('/cotizaciones', cotizacionesRoutes);
router.use('/reportes', reportesRoutes);

module.exports = router;
