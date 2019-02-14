var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipmentSchema = new Schema(
    {
      time: { type: Date, default: Date.now },
      equipmentid: { type: Number, required: true },
      state: { type: Number, required: true }
    }, { collection:"equipmentscollection" } 
  );

// Export model
module.exports = mongoose.model('EquipmentModel', EquipmentSchema);
