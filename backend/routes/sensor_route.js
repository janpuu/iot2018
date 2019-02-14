var express = require('express');
var router = express.Router();

var sensor_controller = require('../controllers/sensorController'); 

//  ROUTES - /invim/sensors

// GET all
router.get('/all', sensor_controller.sensor_getall_get);

// GET one by id (newest)
router.get('/:id', sensor_controller.sensor_getone_get);

// DELETE one
router.delete('/:id/delete', sensor_controller.sensor_deleteone_delete);

// POST one
router.post('/create', sensor_controller.sensor_createone_post);
                                                
module.exports = router;