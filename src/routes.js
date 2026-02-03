const express = require('express');
const router = express.Router();

// Rutas de módulos
const conservacionRoutes = require('./modules/conservacion/conservacion.routes');

router.use('/conservacion', conservacionRoutes);

module.exports = router;
