const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {
      type: String,
      require: true,
      maxlength: 20,
    },
    password: { type: String, require: true, minlength: 6 },
    email: {
      type: String,
      maxlength: 50,
      default: "",
    },
    telephone: { type: String, require: true, minlength: 10, maxlength: 10 },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
