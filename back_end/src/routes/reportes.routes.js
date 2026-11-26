const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { ROLES } = require('../constants/roles');
const controller = require('../controllers/reportes.controller');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.GERENTE));

router.get('/funnel', controller.funnel);
router.get('/ventas', controller.ventas);

module.exports = router;
