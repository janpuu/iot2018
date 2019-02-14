var express = require('express');
var router = express.Router();

var person_controller = require('../controllers/personController'); 

//  ROUTES - /invim/persons

// GET all
router.get('/all', person_controller.person_getall_get);

// GET amount today
router.get('/today', person_controller.person_getamounttoday_get);

// GET amount yesterday
router.get('/yesterday', person_controller.person_getamountyesterday_get);

// GET amount by date - invim/persons/date/:year/:month/:date
router.get('/date/:year/:month/:date', person_controller.person_getamountbydate_get);

// POST one
router.post('/create', person_controller.person_createone_post);
                                                
module.exports = router;