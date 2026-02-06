const express = require('express');
const router = express.Router();

// Rutas de módulos
const conservacionRoutes = require('./modules/conservacion/conservacion.routes');
const actualizacionRoutes = require('./modules/actualizacion/actualizacion.routes');
const calidadRoutes = require('./modules/calidad/calidad.routes');

router.use('/conservacion', conservacionRoutes);
router.use('/actualizacion', actualizacionRoutes);
router.use('/calidad', calidadRoutes);

module.exports = router;
