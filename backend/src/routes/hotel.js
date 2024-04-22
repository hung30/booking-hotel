const express = require("express");
const router = express.Router();

const HotelController = require("../app/controllers/HotelController.js");
const middleWareController = require("../app/controllers/MiddleWareController.js");
const uploadCloud = require("../app/middlewares/uploader.js");

router.post(
  "/new-hotel",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  uploadCloud.single("image"),
  HotelController.addHotel
);

router.get("/", HotelController.getHotel);

router.get("/get-hotel", HotelController.getOneHotel);

module.exports = router;
