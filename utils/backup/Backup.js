const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.QBcreateModel = function(quickbase, dbid) {
  return quickbase
    .api("API_DoQuery", {
      dbid: dbid /* Required */,
      clist: "a",
      slist: "3",
      options: `num-1.sortorder-A`,
      fmt: "structured",
      returnpercentage: true,
      includeRids: false
    })
    .then(async results => {
      //Create schema array
      const fieldNames = results.table.fields.map(field => {
        if (field.field_type == "file") {
          return {
            [field.label]: {
              filename: "string",
              url: "string"
            }
          };
        } else {
          if (field.base_type === "text") return { [field.label]: "string" };
          if (field.base_type === "float") return { [field.label]: "number" };
          if (field.base_type === "int64") return { [field.label]: "date" };
          if (field.base_type === "int32") return { [field.label]: "number" };
          if (field.base_type === "bool") return { [field.label]: "boolean" };
        }
      });

      const schemaObj = fieldNames.reduce((obj, item) => {
        Object.keys(item).map(key => (obj[key] = item[key]));
        return obj;
      }, {});

      const QBmodel = mongoose.model(
        `${results.table.name}_model`,
        new Schema({ model: Array })
      );

      console.log(`Building Model ${results.table.name}_model`);

      if (results.table.records.length > 0)
        new QBmodel({ model: fieldNames }).save();

      const ConvertedRecord = mongoose.model(results.table.name, schemaObj);

      return ConvertedRecord;
    });
};

module.exports.QBgetRecords = function(
  quickbase,
  dbid,
  startIndex,
  ConvertedRecord
) {
  return quickbase
    .api("API_DoQuery", {
      dbid: dbid /* Required */,
      clist: "a",
      slist: "3",
      options: `num-300.sortorder-A.skp-${startIndex}`,
      fmt: "structured",
      returnpercentage: true,
      includeRids: false
    })
    .then(async results => {
      return Promise.all(
        results.table.records.map(async record => {
          let convertedRecord = new ConvertedRecord();

          results.table.fields.map(field => {
            convertedRecord[field.label] = record[field.id.toString()];
          });

          return await convertedRecord.save();
        })
      );
    });
};

module.exports.QBcountRecords = function(quickbase, dbid) {
  //RETURN PROMISE COUNT
  return quickbase
    .api("API_DoQueryCount", {
      dbid: dbid /* Required */,
      query: "{'3'.GT.'0'}" /* Required */
    })
    .then(results => {
      return results.numMatches;
    });
};

module.exports.QBbackupTable = async function(quickbase, dbid) {
  //CREATE MODEL
  const ConvertedRecord = await module.exports.QBcreateModel(quickbase, dbid);

  //COUNT RECORDS
  const recordCount = await module.exports.QBcountRecords(quickbase, dbid);

  //COUNT NUMBER OF REQUESTS NEEDED
  const requests = Math.ceil(recordCount / 300);

  //MAKE EACH REQUEST AND SAVE TO DB
  for (let count = 0; count < requests; count++) {
    //SKIP AMOUNT
    let skip = count * 300;

    //REQUEST
    const completed = await module.exports.QBgetRecords(
      quickbase,
      dbid,
      skip,
      ConvertedRecord
    );

    //LOG
    console.log(`Saved ${dbid} Records: ${skip} - ${completed.length + skip}`);

    //WHEN FINNISHED
    if (completed.length + skip == recordCount) {
      //console.log(`Backup Complete for table: ${dbid}`);
      return `Backup Complete for table: ${dbid}`;
    }
  }
};
