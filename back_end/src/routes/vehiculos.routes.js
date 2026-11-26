const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { ROLES } = require('../constants/roles');
const controller = require('../controllers/vehiculos.controller');

const router = express.Router();

router.use(authenticate);

router.get('/tipos', controller.listarTipos);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', controller.crear);
router.put('/:id', authorize(ROLES.ADMIN), controller.actualizar);
router.delete('/:id', authorize(ROLES.ADMIN), controller.eliminar);

module.exports = router;
