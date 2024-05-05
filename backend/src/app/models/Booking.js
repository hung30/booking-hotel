const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: "Status",
    },
    dayStay: { type: String },
    hourStay: { type: String },
    price: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
