const express = require("express");
const router = express.Router();

const middleWareController = require("../app/controllers/MiddleWareController");
const bookingController = require("../app/controllers/BookingController");

router.get(
  "/getAll",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  bookingController.getAllBookingHotel
);

router.get(
  "/status",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  bookingController.getStatus
);

router.post("/:id", middleWareController.isLogin, bookingController.booking);

router.put(
  "/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  bookingController.updateBooking
);

router.delete(
  "/:id",
  middleWareController.isLogin,
  bookingController.deleteBooking
);

router.get(
  "/:id",
  middleWareController.isLogin,
  bookingController.getBookingFromUserId
);

router.put(
  "/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  bookingController.updateBooking
);

module.exports = router;
