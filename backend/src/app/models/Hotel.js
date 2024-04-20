const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  src: { type: String },
  alt: { type: String },
});

const hotelSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  description: { type: String },
  image: imageSchema,
  price: { type: String },
});

const districtSchema = new mongoose.Schema(
  {
    district: { type: String },
    hotels: [hotelSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", districtSchema);
