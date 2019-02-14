var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SensorSchema = new Schema(
    {
      time: { type: Date, default: Date.now },
      sensorid: { type: Number, required: true },
      state: { type: Number, required: true }    
    }, { collection: "sensorscollection" } 
  );

// Export model
module.exports = mongoose.model('SensorModel', SensorSchema);
