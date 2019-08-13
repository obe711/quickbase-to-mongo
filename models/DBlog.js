const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dbBackupLog = new Schema({
  created: { type: Date, default: Date.now },
  e: { type: String, default: "Error, no Input" }
});

const DBlog = mongoose.model("DBlog", dbBackupLog);

exports.DBlog = DBlog;
