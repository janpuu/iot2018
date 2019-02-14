var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema(
    {
      time: { type: Date, default: Date.now },
      state: { type: Number, required: true }
    }, { collection:"personscollection" } 
  );

// Export model
module.exports = mongoose.model('PersonModel', PersonSchema);
