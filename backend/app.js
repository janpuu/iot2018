var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var sensor_route = require('./routes/sensor_route');
var equipment_route = require('./routes/equipment_route');
var person_route = require('./routes/person_route');
var current_route = require('./routes/current_route');
var compression = require('compression');
var helmet = require('helmet');

let equipment_controller = require('./controllers/equipmentController');
let person_controller = require('./controllers/personController');
let current_controller = require('./controllers/currentController');

let peoplein = 0;
let equipmentstate = 0;
let lightstate = 0;
let visitors = 0;

// 10-19 Windows
// 10 = Windows (random visitors) -- NORMAL setting for testing in Windows
// 11 = Windows (no direct DB posts from Python)
// 12 = Windows (no enter/leaving messages from Python)

// 20-29 Raspberry Pi
// 20 = Raspberry (includes direct DB posts from Python)
// 21 = Raspberry (no direct DB posts from Python) -- NORMAL setting for testing in Raspberry
// 22 = Raspberry real gate test -- NORMAL setting for real life gate operation

let selectedPythonScript = 10;

if (selectedPythonScript == 10) {
  var myPythonScriptPath = 'script_win.py';
} else if (selectedPythonScript == 11) {
  var myPythonScriptPath = 'script_win_no_python_db.py';
} else if (selectedPythonScript == 12) {
  var myPythonScriptPath = 'script_win_nodb.py';
} else if (selectedPythonScript == 20) {
  var myPythonScriptPath = 'script.py';
} else if (selectedPythonScript == 21) {
  var myPythonScriptPath = 'script_nodb.py';
} else if (selectedPythonScript == 22) {
  var myPythonScriptPath = 'script_nodb_gate.py';
} else {
  console.log('Error loading correct Python script.');
}

// Use python shell
var {PythonShell} = require('python-shell');
var pyshell = new PythonShell(myPythonScriptPath);

// Create the Express application object
var app = express();

// Cross-Origin Resource Sharing (CORS)
var cors = require('cors');
app.use(cors());

app.use(helmet());

// Set up mongoose connection
var mongoose = require('mongoose');
// dev_db_url = 'mongodb://user:password@somewhere.else.com:19748/local_library'
// var mongoDB = process.env.MONGODB_URI || dev_db_url;
// mongoose.connect(mongoDB);
mongoose.connect('mongodb://127.0.0.1:27017/invim');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

// http://localhost:3000/
app.use('/', index);
// http://localhost:3000/invim/sensors/
app.use('/invim/sensors', sensor_route);
// http://localhost:3000/invim/equipments/
app.use('/invim/equipments', equipment_route);
// http://localhost:3000/invim/persons/
app.use('/invim/persons', person_route);
// http://localhost:3000/invim/current/
app.use('/invim/current', current_route);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('And so it begins.');

// Async function needed for synchronous database query for variable visitors init
async function run() {

// async/await
visitors = await person_controller.person_countamountyesterday_await();
let peopleintemp = await current_controller.current_latestamounttoday_await();
if (peopleintemp) peoplein = peopleintemp.peoplein;
else console.log('No visitors today yet.');

console.log('People in (continue from last value of today): ', peoplein);

// If no visitors yesterday set fake value
if (visitors == 0) visitors = 42;

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);

  if (message == 'visitor_enter') {
    peoplein++;
    person_controller.person_createone_direct_save(1);

    if (peoplein > 0) {
      if (lightstate == 0) {
        lightstate = 1;
        // Save to DB - light = 1 : state = 1 (ON)
        equipment_controller.equipment_createone_direct_save(1, 1);
      }
      else {
        lightstate = 1;
      }
    }

    if (peoplein > 4) {
      if (equipmentstate == 0) {
        equipmentstate = 1;
        // Save to DB - fan = 2 : state = 1 (ON)
        equipment_controller.equipment_createone_direct_save(2, 1)
      }
      else {
        equipmentstate = 1;
      }
    }

    current_controller.current_createone_direct_save(peoplein, equipmentstate, lightstate, visitors);
  }

  if (message == 'visitor_leave') {

    if (peoplein > 0) {
      peoplein--;
      person_controller.person_createone_direct_save(0);

      if (peoplein == 0) {
        if (lightstate == 1) {
          lightstate = 0;
          // Save to DB - light = 1 : state = 0 (OFF)
          equipment_controller.equipment_createone_direct_save(1, 0);
        }
        else {
          lightstate = 0;
        }
      }

      if (peoplein < 5) {
        if (equipmentstate == 1) {
          equipmentstate = 0;
          // Save to DB - fan = 2 : state = 0 (OFF)
          equipment_controller.equipment_createone_direct_save(2, 0);
        }
        else {
          equipmentstate = 0;
        }
      }

      current_controller.current_createone_direct_save(peoplein, equipmentstate, lightstate, visitors);
    }
    else {
      console.log("Ignore leaving (no persons inside)");
    }
  }
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) {
    console.log('Python script error.');
    throw err;
  };

  console.log('finished');
});

}
// async funtion run()
run();

module.exports = app;