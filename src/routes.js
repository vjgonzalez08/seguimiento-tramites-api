const express = require('express');
const router = express.Router();

// Rutas de módulos
const conservacionRoutes = require('./modules/conservacion/conservacion.routes');
const actualizacionRoutes = require('./modules/actualizacion/actualizacion.routes');
const calidadRoutes = require('./modules/calidad/calidad.routes');
const mutaciones1y5Routes = require('./modules/mutaciones1y5/mutaciones1y5.routes');
const mutaciones23y4Routes = require('./modules/mutaciones23y4/mutaciones23y4.routes');
const juridicaRoutes = require('./modules/juridica/juridica.routes');

router.use('/conservacion', conservacionRoutes);
router.use('/actualizacion', actualizacionRoutes);
router.use('/calidad', calidadRoutes);
router.use('/mutaciones1y5', mutaciones1y5Routes);
router.use('/mutaciones23y4', mutaciones23y4Routes);
router.use('/juridica', juridicaRoutes);

module.exports = router;
