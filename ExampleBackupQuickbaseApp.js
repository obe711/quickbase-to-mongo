"use strict";
const { BackupQuickbaseApp } = require("./BackupQuickbaseApp");

const app = "Quickbase App Name"; //Name to save MongoDB database as
const apid = "qmbtp000p"; //Quickbase App ID

BackupQuickbaseApp(app, apid).then(result => {
  console.log(result);
});
