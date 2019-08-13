var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const quickbaseSchema = new Schema({
  action: String,
  errcode: Number,
  errtext: String,
  time_zone: String,
  date_format: String,
  table: {
    name: String,
    desc: String,
    original: {
      table_id: String,
      app_id: String,
      cre_date: Date,
      mod_date: Date,
      next_record_id: Number,
      next_field_id: Number,
      next_query_id: Number,
      def_sort_fid: Number,
      def_sort_order: Number
    },
    chdbids: [{ name: String, dbid: String }],
    fields: []
  }
});

const fieldsSchema = new Schema({
  label: String,
  nowrap: Number,
  bold: Number,
  required: Number,
  appears_by_default: Number,
  find_enabled: Number,
  allow_new_choices: Number,
  sort_as_given: Number,
  carrychoices: Number,
  foreignkey: Number,
  unique: Number,
  doesdatacopy: Number,
  fieldhelp: String,
  audited: Number,
  max_versions: Number,
  see_versions: Number,
  use_new_window: Number,
  id: Number,
  field_type: String,
  base_type: String
});

const queriesSchema = new Schema({
  qyname: String,
  qytype: String,
  qydesc: String,
  qyslst: String,
  qyopts: String,
  qycalst: String,
  id: Number
});

const tableSchema = new Schema({
  action: String,
  errcode: Number,
  errtext: String,
  time_zone: String,
  date_format: String,
  table: {
    name: String,
    desc: String,
    original: {
      table_id: String,
      app_id: String,
      cre_date: Date,
      mod_date: Date,
      next_record_id: Number,
      next_field_id: Number,
      next_query_id: Number,
      def_sort_fid: Number,
      def_sort_order: Number,
      key_fid: Number,
      single_record_name: String,
      plural_record_name: String
    },
    queries: [queriesSchema],
    fields: [fieldsSchema]
  }
});

const tableBuilderSchema = new Schema({
  name: String,
  table_id: String,
  data: Schema.Types.Mixed
});

const QBApplicationschema = mongoose.model("QBapplication", tableSchema);
const QBTablesschema = mongoose.model("QBtables", tableSchema);
const QBFieldsschema = mongoose.model("QBfields", fieldsSchema);
const QBQuerysschema = mongoose.model("QBquerys", queriesSchema);
const QBBuildschema = mongoose.model("QBbuilder", tableBuilderSchema);

exports.QBApplicationschema = QBApplicationschema;
exports.QBTablesschema = QBTablesschema;
exports.QBFieldsschema = QBFieldsschema;
exports.QBQuerysschema = QBQuerysschema;
exports.tableSchema = tableSchema;
exports.QBBuildschema = QBBuildschema;
