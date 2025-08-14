// routes/templates.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/templates.controller');
router.post('/quincena', ctrl.aplicarQuincena);
router.post('/mensual', ctrl.aplicarMensual);
module.exports = router;
