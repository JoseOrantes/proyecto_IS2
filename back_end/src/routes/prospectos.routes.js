const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { ROLES } = require('../constants/roles');
const controller = require('../controllers/prospectos.controller');

const router = express.Router();
const PERMITIDOS = [ROLES.ADMIN, ROLES.GERENTE, ROLES.VENDEDOR];

router.use(authenticate, authorize(...PERMITIDOS));

router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', controller.crear);
router.put('/:id', authorize(ROLES.ADMIN), controller.actualizar);
router.post('/:id/convertir', controller.convertir);
router.delete('/:id', authorize(ROLES.ADMIN), controller.eliminar);

module.exports = router;
