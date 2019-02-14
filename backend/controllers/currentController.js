var CurrentModel = require('../models/current_model')
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// GET latest current situation
exports.current_getlatest_get = function (req, res, next) {
    CurrentModel.
        findOne().
        sort({time: -1}).
        exec(function(err2, res2) {
		if (err2) { return next(err2); }
		else { res.json(res2); }		
	});
};

// GET today (ALL! - possible problems with drawing chart to a too small area with high amounts of data)
exports.current_gettodayall_get = function (req, res, next) {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth(); 
	let date = today.getDate();

	CurrentModel.
		find().
		where("time").gte(new Date(year, month, date)). // lt(new Date(year, month, date, hour + 1)).
		limit().
		sort({time: -1}).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2.reverse()); }
		});
};

// GET today (amount in request)
exports.current_gettodayamount_get = function (req, res, next) {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth(); 
	let date = today.getDate();

	const limitInt = parseInt(req.params.amount);
	// const limitInt = -Math.abs(parseInt(req.params.amount));

	CurrentModel.
		find().
		// batchSize(140). // use with negative limit(), default value: 101
		where("time").gte(new Date(year, month, date)). // lt(new Date(year, month, date, hour + 1)).
		limit(limitInt). // limited to x last points, negative limit for some performance boost
		sort({time: -1}).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2.reverse()); }
		});
};

// GET by date and time (hour) - /date/:year/:month/:date/:hour
exports.current_getbydate_get = function (req, res, next) {
	let year = Number(req.params.year);
	let month = Number(req.params.month);
    let date = Number(req.params.date);
	let hour = Number(req.params.hour);
	
	CurrentModel.
		find().
		where("time").gte(new Date(year, month, date, hour)). // lt(new Date(year, month, date, hour + 1)).
        sort({time: 1}).
        limit(1).
		exec(function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2); }
	});
};

// POST - Create new current situation - /create
exports.current_createone_post =
[
        // Validate input
        body('peoplein').isInt().trim().withMessage('Peoplein is not a number.'),
        body('equipmentstate').isInt().trim().withMessage('Equipmentstate is not a number.'),
        body('lightstate').isInt().trim().withMessage('Lightstate is not a number.'),
        // body('visitors').isInt().trim().withMessage('Visitors is not a number.'),

		// Sanitize fields
        sanitizeBody('time').trim().escape(),
        sanitizeBody('peoplein').trim().escape(),
        sanitizeBody('equipmentstate').trim().escape(),
        sanitizeBody('lightstate').trim().escape(),
        sanitizeBody('visitors').trim().escape(),
	
	(req, res, next) =>
	{
		const validationerror = validationResult(req);
		
		if (!validationerror.isEmpty()) {
			return res.status(422).json({ errors: validationerror.mapped() });
		}
		
		let NewCurrentModel = new CurrentModel
		({
            time: req.body.time,
            peoplein: req.body.peoplein,
            equipmentstate: req.body.equipmentstate,
            lightstate: req.body.lightstate,
			visitors: req.body.visitors
		});
		NewCurrentModel.save( function(err2, res2) {
			// jump away if error found
			if (err2) { return next(err2); }
			else { res.json(res2); }	
		});
	}
];

// Visitor amount latest today - await
async function current_latestamounttoday_await() 
{
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth(); 
	let date = today.getDate();

    return await CurrentModel.
		findOne().
		where("time").gte(new Date(year, month, date)).
        sort({time: -1}).
        exec(function(err, res) {
			// jump away if error found
			if (err) { return next(err); }
			else { return res }		
	});
};
module.exports.current_latestamounttoday_await = current_latestamounttoday_await;

// SAVE to DB - Create new current situation
exports.current_createone_direct_save = (peoplein2, equipmentstate2, lightstate2, visitors2) => {

	let NewCurrentModel = new CurrentModel
		({
			time: new Date(),
			peoplein: peoplein2,
			equipmentstate: equipmentstate2,
			lightstate: lightstate2,
			visitors: visitors2
		});
	NewCurrentModel.save(function (err, saved) {
		// jump away if error found
		if (err) { return console.error(err); }
		else { return (JSON.stringify(saved)); }
	});
};