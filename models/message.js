const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

let Message = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

Message.virtual("timeFormatted").get(function() {
  return moment(this.timestamp).format("h:mm:ss a");
});

module.exports = mongoose.model("Message", Message);
