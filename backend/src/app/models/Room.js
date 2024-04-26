const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  district: {
    type: Schema.Types.ObjectId,
    ref: "District",
  },
  name: { type: String },
  area: { type: String },
  description: { type: String },
  suitableFor: { type: String },
  price: { type: String },
});

module.exports = mongoose.model("Room", RoomSchema);
