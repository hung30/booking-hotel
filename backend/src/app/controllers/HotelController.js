const { query } = require("express");
const Hotel = require("../models/Hotel");
const District = require("../models/District");
const Room = require("../models/Room");
const {
  Types: { ObjectId },
} = require("mongoose");

function convertToLowerCase(str) {
  return str.toLowerCase();
}
class HotelController {
  //[POST] /hotel/new-hotel
  async addHotel(req, res) {
    try {
      const src = await req.file.path;
      if (!src) {
        return res.json({
          message: "khong co file anh",
        });
      }
      const newImage = {
        src: src,
        alt: req.body.alt,
      };

      const isDistrict = await District.findById(req.body.district);
      if (!isDistrict) {
        return res.status(404).json({
          message: `Khong tim thay quan nao`,
        });
      }
      const rooms = await Room.findById(req.body.room).populate("district");
      if (rooms.length === 0) {
        return res.status(404).json({
          message: `Khong tim thay phong nao co ten ${room}`,
        });
      }

      if (isDistrict._id.toString() != rooms.district._id.toString()) {
        return res.json({
          message: `Phong nay khong o quan ${isDistrict.name} ma o quan ${rooms.district.name}`,
        });
      }

      const newHotel = await new Hotel({
        nameHotel: req.body.nameHotel,
        description: req.body.description,
        distanceFormCenter: req.body.distanceFormCenter,
        image: newImage,
        evaluate: req.body.evaluate,
        district: isDistrict.id,
        room: rooms._id,
      });

      const hotel = await newHotel.save();
      res.status(201).json({
        message: "them hotel thanh cong",
        hotel,
      });
    } catch (err) {
      return res.json(err);
    }
  }

  // [POST] /hotel/new-room
  async newRoom(req, res) {
    try {
      const district = await District.findById(req.body.district);
      if (!district) {
        return res.status(404).json({
          message: `Khong tim thay quan`,
        });
      }
      const newRoom = await new Room({
        name: req.body.name,
        area: req.body.area,
        description: req.body.description,
        suitableFor: req.body.suitableFor,
        price: req.body.price,
        district: district._id,
      });
      if (!newRoom) {
        return res.status(422).json({
          message: "Them room that bai",
        });
      }
      const room = await newRoom.save();
      return res.status(201).json({
        message: "Them room thanh cong",
        room,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[PUT] /hotel/add-room-hotel thêm phòng cho khách sạn
  async addRoomHotel(req, res) {
    try {
      const hotelId = await Hotel.findById(req.body.hotel);
      if (!hotelId) {
        return res.status(404).json({
          message: "Khong tim thay khach san",
        });
      }
      const district = await District.findById(req.body.district);
      if (!district) {
        return res.status(404).json({
          message: "Khong tim thay quan",
        });
      }

      const roomId = await Room.findById(req.body.room);

      if (!roomId) {
        return res.status(404).json({
          message: "Khong tim thay phong",
        });
      }
      if (hotelId.district.toString() !== roomId.district.toString()) {
        return res.json({
          message: "Khong the them vi khac quan",
        });
      }

      const roomExists = hotelId.room.some(
        (room) => room.toString() === roomId.id.toString()
      );

      // Nếu có phòng trùng, trả về thông báo lỗi
      if (roomExists) {
        return res.status(400).json({
          message: "Phong da ton tai",
        });
      }
      const hotel = await Hotel.findByIdAndUpdate(
        hotelId.id,
        {
          $push: { room: roomId.id },
        },
        { new: true }
      );
      if (!hotel) {
        return res.json({
          message: "Them phong cho khach san that bai",
        });
      }
      return res.status(200).json({
        message: "Them thanh cong",
        hotel,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[PUT] /hotel/update-hotel
  async updateHotel(req, res) {
    try {
      const hotelId = req.params.id;

      const src = req.file.path;

      if (!src) {
        return res.json({
          message: "khong co file anh",
        });
      }

      const newImage = {
        src: src,
        alt: req.body.alt,
      };

      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotelId,
        {
          nameHotel: req.body.nameHotel,
          description: req.body.description,
          image: newImage,
          evaluate: req.body.evaluate,
        },
        { new: true }
      );
      if (!updatedHotel) {
        return res.json({
          message: "Sua khong thanh cong",
        });
      }
      return res.status(200).json({
        message: "Thanh cong",
        updatedHotel,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[DELETE] /hotel/delete-hotel
  async deleteHotel(req, res) {
    try {
      const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!deletedHotel) {
        return res.json({
          message: "Xoa that bai",
        });
      }
      return res.status(200).json({
        message: "Xoa thanh cong",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // [GET] /hotel
  async getHotel(req, res) {
    try {
      const data = await Hotel.find({})
        .populate("district")
        .populate("room")
        .populate({
          path: "room",
          populate: "district",
        });

      if (!data) {
        return res.status(404).json({
          message: "Khong tim thay khach san nao",
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[GET] /hotel/get-by-district
  async getHotelByDistrictName(req, res) {
    try {
      const district = req.params.id;
      const districtId = new ObjectId(district);
      const data = await District.aggregate([
        {
          $match: {
            _id: districtId,
          },
        },
        {
          $lookup: {
            from: "hotels",
            localField: "_id",
            foreignField: "district",
            as: "hotels",
          },
        },
        { $unwind: "$hotels" },
        {
          $lookup: {
            from: "rooms",
            localField: "hotels.room",
            foreignField: "_id",
            as: "rooms",
          },
        },
        {
          $set: {
            "hotels.room": "$rooms",
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            hotels: { $push: "$hotels" },
          },
        },
      ]);

      if (data.length === 0) {
        return res.status(404).json({
          message: "Khong tim thay khach san nao",
        });
      }
      return res.status(200).json(data[0] || {});
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

  //[GET] /hotel/get-one-hotel get by idHotel
  async getOneHotel(req, res) {
    try {
      const hotel = await Hotel.findById(req.params.id)
        .populate("district")
        .populate("room")
        .populate({
          path: "room",
          populate: "district",
        });
      if (!hotel) {
        return res.status(404).json({
          message: `Khong tim thay khach san nao ten ${nameHotel}`,
        });
      }
      return res.status(200).json(hotel);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[GET] /hotel/room
  async getRoom(req, res) {
    try {
      const data = await Room.find({ district: req.params.id }).populate(
        "district"
      );
      if (!data.length) {
        return res.status(404).json({
          message: "Khong thay phong nao ca",
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
  //[GET] /hotel/district
  async getDistrict(req, res) {
    try {
      const data = await District.find();
      if (!data.length) {
        return res.status(404).json({
          message: "Khong thay quan nao ca",
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
}

module.exports = new HotelController();
