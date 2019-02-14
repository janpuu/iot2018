var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CurrentSchema = new Schema(
    {
      time: { type: Date, default: Date.now },
      peoplein: { type: Number, required: true },
      equipmentstate: { type: Number, required: true },
      lightstate: { type: Number, required: true },
      visitors: { type: Number, default: 42 }
    }, { collection:"currentcollection" } 
  );

// Export model
module.exports = mongoose.model('Current_model', CurrentSchema);
