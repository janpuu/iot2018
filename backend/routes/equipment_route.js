var express = require('express');
var router = express.Router();

var equipment_controller = require('../controllers/equipmentController'); 

//  ROUTES - /invim/equipments

// GET all
router.get('/all', equipment_controller.equipment_getall_get);

// GET one by id (newest)
router.get('/:id', equipment_controller.equipment_getone_get);

// DELETE one
router.delete('/:id/delete', equipment_controller.equipment_deleteone_delete);

// POST one
router.post('/create', equipment_controller.equipment_createone_post);
                                                
module.exports = router;