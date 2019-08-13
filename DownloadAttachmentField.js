"use strict";

require("dotenv").config();
const wget = require("node-wget");
const fs = require("fs");

module.exports.DownloadAttachments = async function(db, collection, field) {
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  mongoose
    .connect(`${process.env.MONGOURL}/${db}`, {
      useNewUrlParser: true
    })
    .then(() => console.log("Connected to Mongo..."))
    .catch(err => console.error("Could not connect...", err));

  const QBmodel = mongoose.model(
    `${collection}_models`,
    new Schema({ model: Array })
  );

  try {
    fs.mkdir(`./up/${field}`, { recursive: true }, err => {
      if (err) throw err;
    });

    const tableSchema = await QBmodel.findOne();

    const schemaObj = tableSchema.model.reduce((obj, item) => {
      Object.keys(item).map(key => (obj[key] = item[key]));
      return obj;
    }, {});

    const TableModel = mongoose.model(collection, new Schema(schemaObj));

    const count = await TableModel.find({}).countDocuments();

    const requests = Math.ceil(count / 100);

    console.log(requests);

    for (let cycle = 0; cycle < requests; cycle++) {
      const downloadList = await TableModel.find({})
        .select({
          [field]: 1
        })
        .skip(cycle)
        .limit(100);

      download(downloadList, field);
    }
  } catch (ex) {
    console.log(ex);
  } finally {
  }
};

async function download(downloadList, field) {
  await downloadList.map(download => {
    if (download[field]["filename"]) {
      const url = download[field]["url"];
      const _id = download["_id"];
      const filename = download[field]["filename"];

      console.log(url, _id);

      wget(
        {
          url: url,
          dest: `./up/${field}/${filename}`,
          timeout: 2000
        },
        function(error) {
          if (error) {
            console.log("--- error:");
            console.log(error);
          } else {
            console.log(`Moved ${filename}`);

            //UPDATE LINK IN MONGODB
            //TableModel.findByIdAndUpdate(_id, {[field]['url']: })
          }
        }
      );
      return;
    }
  });
}
