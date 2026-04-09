const express = require('express');
const router = express.Router();

// Rutas de módulos
const conservacionRoutes = require('./modules/conservacion/conservacion.routes');
const actualizacionRoutes = require('./modules/actualizacion/actualizacion.routes');
const calidadRoutes = require('./modules/calidad/calidad.routes');
const mutacionesRoutes = require('./modules/mutaciones/mutaciones.routes');
const juridicaRoutes = require('./modules/juridica/juridica.routes');

router.use('/conservacion', conservacionRoutes);
router.use('/actualizacion', actualizacionRoutes);
router.use('/calidad', calidadRoutes);
router.use('/mutaciones', mutacionesRoutes);
router.use('/juridica', juridicaRoutes);

module.exports = router;
