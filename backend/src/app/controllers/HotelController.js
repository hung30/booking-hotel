const { query } = require("express");
const Hotel = require("../models/Hotel");
const District = require("../models/District");
const Room = require("../models/Room");

function convertToLowerCase(str) {
  return str.toLowerCase();
}
class HotelController {
  //[POST] /hotel/new-hotel
  async addHotel(req, res) {
    try {
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

      const district = convertToLowerCase(req.body.district);
      const isDistrict = await District.findOne({
        name: district,
      });
      if (!isDistrict) {
        return res.status(404).json({
          message: `Khong co quan nao ten ${district}`,
        });
      }
      const room = req.body.room;
      const regex = new RegExp(room, "i");
      const rooms = await Room.find({
        name: regex,
      });
      if (rooms.length === 0) {
        return res.status(404).json({
          message: `Khong tim thay phong nao co ten ${room}`,
        });
      }

      //Check xem phòng có giá ứng với quận đó không
      var newRoom;
      rooms.forEach((room) => {
        if (room.district.toString() === isDistrict.id) {
          newRoom = room;
        }
      });
      if (!newRoom) {
        res.status(404).json({
          message: `khong tim thay gia phong khach san o quan ${isDistrict.name}`,
        });
      }
      const newHotel = await new Hotel({
        nameHotel: req.body.nameHotel,
        description: req.body.description,
        distanceFormCenter: req.body.distanceFormCenter,
        image: newImage,
        evaluate: req.body.evaluate,
        district: isDistrict.id,
        room: newRoom._id,
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
      const districtName = convertToLowerCase(req.body.district);
      const district = await District.findOne({
        name: districtName,
      });
      if (!district) {
        return res.status(404).json({
          message: `Khong tim thay quan ban nhap: ${districtName}`,
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
      const hotelName = req.body.hotelName;
      const regex = new RegExp(hotelName, "i");
      const hotelId = await Hotel.findOne({ nameHotel: regex });
      if (!hotelId) {
        return res.status(404).json({
          message: "Khong tim thay khach san",
        });
      }
      const districtName = req.body.districtName;
      const districtRegex = new RegExp(districtName, "i");
      const district = await District.findOne({
        name: districtRegex,
      });
      if (!district) {
        return res.status(404).json({
          message: "Khong tim thay quan",
        });
      }
      const roomName = req.body.roomName;
      const roomRegex = new RegExp(roomName, "i");

      const roomId = await Room.findOne({
        name: roomRegex,
        district: district._id,
      });

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
      const nameHotel = req.body.name;
      const regex = new RegExp(nameHotel, "i");
      const data = await District.aggregate([
        {
          $match: {
            name: regex,
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
      return res.status(500).json(err);
    }
  }

  //[GET] /hotel/get-one-hotel get by name hotel
  async getOneHotel(req, res) {
    try {
      const nameHotel = req.body.nameHotel;
      const regex = new RegExp(`^${nameHotel}`, "i");
      const hotel = await Hotel.findOne({
        nameHotel: regex,
      })
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
}

module.exports = new HotelController();
