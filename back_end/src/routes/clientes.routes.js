const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { ROLES } = require('../constants/roles');
const controller = require('../controllers/clientes.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize(ROLES.ADMIN, ROLES.GERENTE, ROLES.VENDEDOR), controller.listar);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.GERENTE, ROLES.VENDEDOR), controller.obtener);
router.post('/', authorize(ROLES.ADMIN, ROLES.GERENTE, ROLES.VENDEDOR), controller.crear);
router.put('/:id', authorize(ROLES.ADMIN), controller.actualizar);
router.delete('/:id', authorize(ROLES.ADMIN), controller.eliminar);

module.exports = router;
