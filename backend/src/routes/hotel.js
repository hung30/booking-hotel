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
router.delete(
  "/delete-room/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.deleteRoom
);

router.put(
  "/update-hotel/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  uploadCloud.single("image"),
  HotelController.updateHotel
);

router.put(
  "/add-room-hotel/:id",
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

router.get("/get-by-district/:id", HotelController.getHotelByDistrictName);
router.get("/get-one-hotel/:id", HotelController.getOneHotel);
router.get("/room/:id", HotelController.getRoomById);
router.get(
  "/room-from-district/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  HotelController.getRoom
);
router.get("/all-room", HotelController.getAllRoom);
router.get("/district", HotelController.getDistrict);
router.get("/", HotelController.getHotel);

module.exports = router;
