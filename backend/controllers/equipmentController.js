var EquipmentModel = require('../models/equipment_model')
var async = require('async')

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// GET all
exports.equipment_getall_get = function (req, res, next) 
{ 
	EquipmentModel.find({}, function(err2, res2) {
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
exports.equipment_getone_get = function (req, res, next) 
{
	EquipmentModel.findOne({ equipmentid: req.params.id }, {}, { sort: { 'time' : -1 } }, function(err2, res2) {
		if (err2) {
			return next(err2);
		}
		else {
			res.json(res2);
		}	
	});
};

// DELETE one
exports.equipment_deleteone_delete = function (req, res, next) 
{
	EquipmentModel.findOneAndRemove( 
		{ equipmentid : req.params.id },
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
exports.equipment_createone_post =
[
		// Validate input
		body('equipmentid').isInt().trim().withMessage('EquipmentId is not a number.'),
		body('state').isInt().trim().withMessage('State is not a number.'),

		// Sanitize fields
		sanitizeBody('time').trim().escape(),
		sanitizeBody('equipmentid').trim().escape(),
		sanitizeBody('state').trim().escape(),
	
	(req, res, next) =>
	{
		const validationerror = validationResult(req);
		
		if (!validationerror.isEmpty())
		{
			return res.status(422).json({ errors: validationerror.mapped() });
		}
		
		let NewEquipmentModel = new EquipmentModel
		({
			time: req.body.time,
			equipmentid: req.body.equipmentid,
			state: req.body.state
		});
		NewEquipmentModel.save( function(err2, res2)
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

// SAVE to DB - Create new equipment state
exports.equipment_createone_direct_save = (eid, estate) => {

	let NewEquipmentModel = new EquipmentModel
		({
			time: new Date(),
			equipmentid: eid,
			state: estate
		});
	NewEquipmentModel.save(function (err, saved) {
		// jump away if error found
		if (err) {
			return console.error(err);
		}
		else {
			// no error - return this
			return (JSON.stringify(saved));
		}
	});
}