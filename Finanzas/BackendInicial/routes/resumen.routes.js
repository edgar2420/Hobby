// routes/resumen.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/resumen.controller');
router.get('/', ctrl.getResumen);
module.exports = router;
