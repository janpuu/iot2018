var SensorModel = require('../models/sensor_model')
var async = require('async')

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// GET all
exports.sensor_getall_get = function (req, res, next) 
{ 
	SensorModel.find({}, function(err2, res2) {
		// jump away if error found
		if (err2) {
			return next(err2);
		}
		else {
			// no error - return this
			res.json(res2);
		}	
	});
};

// GET one by id (newest)
exports.sensor_getone_get = function (req, res, next) 
{
	SensorModel.findOne({ sensorid: req.params.id }, {}, { sort: { 'time' : -1 } }, function(err2, res2) {
		if (err2) {
			return next(err2);
		}
		else {
			res.json(res2);
		}	
	});
};

// DELETE one
exports.sensor_deleteone_delete = function (req, res, next) 
{
	SensorModel.findOneAndRemove( 
		{ sensorid : req.params.id },
		function(err2, res2)
		{
			if (err2) {
				return next(err2);
			}
			else {
				res.json(res2);
			}	
		});
};

// POST one
exports.sensor_createone_post =
[
		// Validate input
		body('sensorid').isInt().trim().withMessage('SensorId is not a number.'),
		body('state').isInt().trim().withMessage('State is not a number.'),

		// Sanitize fields
		sanitizeBody('time').trim().escape(),
		sanitizeBody('sensorid').trim().escape(),
		sanitizeBody('state').trim().escape(),
	
	(req, res, next) =>
	{
		const validationerror = validationResult(req);
		
		if (!validationerror.isEmpty())
		{
			return res.status(422).json({ errors: validationerror.mapped() });
		}
		
		let NewSensorModel = new SensorModel
		({
			time: req.body.time,
			sensorid: req.body.sensorid,
			state: req.body.state
		});
		NewSensorModel.save( function(err2, res2)
		{
			if (err2)
			{
				return next(err2);
			}
			else
			{
				res.json(res2);
			}	
		});
	}
];