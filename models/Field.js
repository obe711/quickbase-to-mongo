var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const fieldSchema = new Schema({
  label: String,
  id: Number,
  field_type: String,
  base_type: String
});

exports.fieldSchema = fieldSchema;
