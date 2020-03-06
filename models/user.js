const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  membership: { type: String, required: true, enum: ["Member", "Not Member"] }
});

module.exports = mongoose.model("User", User);
