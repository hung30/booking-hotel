const express = require("express");
const router = express.Router();

const HotelController = require("../app/controllers/HotelController.js");
const middleWareController = require("../app/controllers/MiddleWareController.js");
const uploadCloud = require("../app/middlewares/uploader.js");

router.post(
  "/new-hotel",
  uploadCloud.single("image"),
  HotelController.addHotel
);

router.get("/", HotelController.getHotel);

module.exports = router;
