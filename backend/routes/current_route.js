var express = require('express');
var router = express.Router();

var current_controller = require('../controllers/currentController'); 

//  ROUTES - /invim/current

// GET current situation
router.get('/', current_controller.current_getlatest_get);

// GET today situation
router.get('/today', current_controller.current_gettodayall_get);

// GET today situation with limited amount
router.get('/today/:amount', current_controller.current_gettodayamount_get);

// GET current situation by date and time
router.get('/date/:year/:month/:date/:hour', current_controller.current_getbydate_get);

// POST create new current situation
router.post('/create', current_controller.current_createone_post);
                                                
module.exports = router;