var PersonModel = require('../models/person_model')
var async = require('async')

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// GET all
exports.person_getall_get = function (req, res, next) 
{ 
	PersonModel.find({}, function(err2, res2) {
		// jump away if error found
		if (err2) { return next(err2); }
		else { res.json(res2); }	
	});
};

// GET visitor amount today - /today
exports.person_getamounttoday_get = function (req, res, next) 
{
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth(); 
	let date = today.getDate();

	PersonModel.
		count().
		where("time").gte(new Date(year, month, date)).
		where("state").equals(1).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2); }
		});
};

// GET visitor amount yesterday - /yesterday
exports.person_getamountyesterday_get = function (req, res, next) 
{
	let today = new Date();
	let yesterday = new Date(new Date().setDate(new Date().getDate()-1));

	let year = today.getFullYear();
	let month = today.getMonth(); 
	let date = today.getDate();
	let year2 = yesterday.getFullYear();
	let month2 = yesterday.getMonth(); 
	let date2 = yesterday.getDate();

	PersonModel.
		count().
		where("time").gte(new Date(year2, month2, date2)).lt(new Date(year, month, date)).
		where("state").equals(1).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2); }
		});
};

// GET by date - /date/:year/:month/:date
exports.person_getamountbydate_get = function (req, res, next) 
{
	let year = Number(req.params.year);
	let month = Number(req.params.month);
	let date = Number(req.params.date);

	PersonModel.
		count().
		where("time").gte(new Date(year, month, date)).lt(new Date(year, month, date + 1)).
		where("state").equals(1).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2); }
	});
};

// POST - Create new data for person document - /create
exports.person_createone_post =
[
		// Validate input
		body('state').isInt().trim().withMessage('State is not a number.'),

		// Sanitize fields
		sanitizeBody('time').trim().escape(),
		sanitizeBody('state').trim().escape(),
	
	(req, res, next) =>
	{
		const validationerror = validationResult(req);
		
		if (!validationerror.isEmpty()) {
			return res.status(422).json({ errors: validationerror.mapped() });
		}
		
		let NewPersonModel = new PersonModel
		({
			time: req.body.time,
			state: req.body.state
		});
		NewPersonModel.save( function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2); }	
		});
	}
];

// Visitor amount yesterday - await
// MongoDB query $gte yesterday, $lt today --> yesterday
// db.personscollection.find({"time": {"$gte": new Date(2019, 0, 2), "$lt": new Date(2019, 0, 3)}})
async function person_countamountyesterday_await() 
{
	let today = new Date();
	let yesterday = new Date(new Date().setDate(new Date().getDate()-1));

	let year = today.getFullYear();
	let month = today.getMonth(); 
	let date = today.getDate();
	let year2 = yesterday.getFullYear();
	let month2 = yesterday.getMonth(); 
	let date2 = yesterday.getDate();

	return await PersonModel.
		count().
		where("time").gte(new Date(year2, month2, date2)).lt(new Date(year, month, date)).
		where("state").equals(1).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return err2; }
			else {
				return res2;
			}
		});
};
module.exports.person_countamountyesterday_await = person_countamountyesterday_await;

// SAVE to DB - Create new person information
exports.person_createone_direct_save = (state) => {
	let NewPersonModel = new PersonModel
		({
			time: new Date(),
			state: state
		});
	NewPersonModel.save(function (err, saved) {
		// jump away if error found
		if (err) { return console.error(err); }
		else { return (JSON.stringify(saved)); }
	});
}