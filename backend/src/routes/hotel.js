const express = require("express");
const router = express.Router();

const HotelController = require("../app/controllers/HotelController.js");
const middleWareController = require("../app/controllers/MiddleWareController.js");
const uploadCloud = require("../app/middlewares/uploader.js");

router.delete(
  "/delete-hotel/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.deleteHotel
);

router.put(
  "/update-hotel/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  uploadCloud.single("image"),
  HotelController.updateHotel
);

router.put(
  "/add-room-hotel",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.addRoomHotel
);

router.post(
  "/new-hotel",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  uploadCloud.single("image"),
  HotelController.addHotel
);

router.post(
  "/new-room",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.newRoom
);

router.get("/get-by-district", HotelController.getHotelByDistrictName);
router.get("/get-one-hotel", HotelController.getOneHotel);
router.get(
  "/room-from-district",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.getRoom
);
router.get(
  "/district",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.getDistrict
);
router.get("/", HotelController.getHotel);

router.get("/get-hotel", HotelController.getOneHotel);

module.exports = router;
