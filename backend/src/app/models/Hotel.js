const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  src: { type: String },
  alt: { type: String },
});

const hotelSchema = new Schema(
  {
    nameHotel: { type: String },
    description: { type: String },
    distanceFormCenter: { type: String },
    image: imageSchema,
    evaluate: { type: String },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
    room: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
