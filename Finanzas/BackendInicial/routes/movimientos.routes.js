// routes/movimientos.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/movimientos.controller');
router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
router.delete('/:id', ctrl.eliminar);
module.exports = router;
