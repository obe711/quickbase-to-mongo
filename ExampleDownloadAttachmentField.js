"use strict";
const { DownloadAttachments } = require("./DownloadAttachmentField");

const app = "Quickbase App Name"; //Name of MongoDB database

const collection = "collection Name Here"; //Collection with files
const field = "field of File Dowload Here"; //Field of files

DownloadAttachments(app, collection, field);
