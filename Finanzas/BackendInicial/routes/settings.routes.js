// routes/settings.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/settings.controller');
router.get('/', ctrl.get);
router.put('/', ctrl.update);
module.exports = router;
