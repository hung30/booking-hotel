const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Status = new Schema(
  {
    status: { type: String },
  },
  { model: "status" }
);

module.exports = mongoose.model("Status", Status);
