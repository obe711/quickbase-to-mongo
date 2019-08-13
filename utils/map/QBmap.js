"use strict";
/*
    Function to create collection of mapped Quickbase fields

    Params: 
        quickbase = Quickbase connection object
        dbid = Quickbase Table ID

*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { fieldSchema } = require("../../models/Field");

module.exports.QBmap = async function(quickbase, dbid) {
  const Field = mongoose.model(`${dbid}_map`, fieldSchema);
  const exists = await Field.findOne({}).countDocuments();

  if (exists) console.warn(`${dbid}_map Already Exists - Not Created`);
  else {
    quickbase
      .api("API_DoQuery", {
        dbid: dbid,
        slist: "3",
        options: "num-1.sortorder-A",
        fmt: "structured",
        returnpercentage: true,
        includeRids: false
      })
      .then(results => {
        //console.log(results.table.fields);
        return results.table.fields;
      })
      .then(async fields => {
        //console.log(fields);

        return Promise.all(
          fields.map(async field => {
            const newField = await new Field({
              label: field.label,
              id: field.id,
              field_type: field.field_type,
              base_type: field.base_type
            }).save();
            return newField;
          })
        );
      })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
