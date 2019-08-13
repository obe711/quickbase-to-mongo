"use strict";

require("dotenv").config();

const { QBbackupTable } = require("./utils/backup/Backup");
const { QBgetTableIds } = require("./utils/map/QBgetTableIds");

const QuickBase = require("quickbase");
const quickbase = new QuickBase({
  realm: process.env.REALM,
  appToken: process.env.APPTOKEN,
  userToken: process.env.USERTOKEN
});

module.exports.BackupQuickbaseApp = async function(app, apid) {
  const mongoose = require("mongoose");
  mongoose
    .connect(`${process.env.MONGOURL}/${app}`, {
      useNewUrlParser: true
    })
    .then(() => console.log("Connected to Mongo..."))
    .catch(err => console.error("Could not connect...", err));

  try {
    const tableIds = await QBgetTableIds(quickbase, apid);

    await Promise.all(
      await tableIds.map(async table => {
        return await QBbackupTable(quickbase, table);
      })
    );
    return await `Backup of ${app} Complete`;
  } catch (ex) {
    console.log(ex);
  } finally {
    mongoose.disconnect(err => {
      if (err) console.log(err);
    });
  }
};
