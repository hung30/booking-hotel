const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Status = require("../models/Status");
const jwt = require("jsonwebtoken");

class BookingController {
  //[GET] /booking/getAll
  async getAllBookingHotel(req, res) {
    try {
      const data = await Booking.find()
        .populate({ path: "user", select: "-password -admin" })
        .populate("hotel")
        .populate({
          path: "hotel",
          populate: "district",
        })
        .populate("room")
        .populate("status");
      if (!data.length) {
        return res.status(404).json({
          message: "Khong tim thay Booking nao",
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

  //[GET] /booking/:userId
  async getBookingFromUserId(req, res) {
    try {
      const data = await Booking.find({ user: req.params.id })
        .populate({ path: "user", select: "-password -admin" })
        .populate("hotel")
        .populate({
          path: "hotel",
          populate: "district",
        })
        .populate("room")
        .populate("status");
      if (!data.length) {
        return res.status(404).json({
          message: "Khong tim thay Booking nao",
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

  //[GET] /booking/status
  async getStatus(req, res) {
    try {
      const data = await Status.find();
      if (!data.length) {
        res.status(404).json({
          message: "Khong thay status nao",
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

  //[DELETE] /booking
  async deleteBooking(req, res) {
    try {
      const deleteBooking = await Booking.findByIdAndDelete(req.params.id);
      if (!deleteBooking) {
        return res.json({
          message: "Xoa phong that bai",
        });
      }
      return res.status(200).json({
        message: "Xoa phong thanh cong",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
  //[POST] /booking
  async booking(req, res) {
    try {
      const token = req.cookies.token;
      const user = jwt.verify(token, process.env.JWT_KEY);
      const roomId = req.body.room;
      const room = await Room.findById(roomId);
      const price = (
        parseFloat(room.price) * parseFloat(req.body.hourStay)
      ).toFixed(2);

      const newBooking = new Booking({
        user: user.id,
        hotel: req.params.id,
        room: roomId,
        status: "6630a2ae2788c38303f5ead6",
        dayStay: req.body.dayStay,
        hourStay: req.body.hourStay,
        price: price.toString(),
      });
      if (!newBooking) {
        return res.json({
          message: "That bai",
        });
      }
      const booking = await newBooking.save();
      res.status(201).json({
        message: "Thanh cong",
        booking,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

  //[PUT] /booking/
  async updateBooking(req, res) {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        { new: true }
      );
      if (!booking) {
        return res.json({
          message: "That bai",
        });
      }
      return res.status(200).json({
        message: "Thanh cong",
        booking,
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
}

module.exports = new BookingController();
