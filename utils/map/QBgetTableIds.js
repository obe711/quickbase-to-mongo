"use strict";
/*
    Function to create Array of Quickbase Tables

    Params: 
        quickbase = Quickbase connection object
        dbid = Quickbase Database ID
        
    Returns Promise Array 

*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.QBgetTableIds = async function(quickbase, dbid) {
  //GET QB SCHEMA
  return quickbase
    .api("API_GetSchema", {
      dbid: dbid
    })
    .then(results => {
      return results.table.chdbids;
    })
    .then(chdbids => {
      //RETURN ONLY IDS FROM DATA
      return chdbids.map(table => {
        return table.dbid;
      });
    })
    .then(idArray => {
      //RETURN PROMISE
      return idArray;
    })
    .catch(err => {
      console.error(err);
    });
};
