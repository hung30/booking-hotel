const Hotel = require("../models/Hotel");

class HotelController {
  //[POST] /hotel
  async addHotel(req, res) {
    try {
      const district = await req.body.district;
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

      const newHotel = {
        name: req.body.name,
        image: newImage,
        description: req.body.description,
        price: req.body.price,
      };

      const isDistrict = await Hotel.findOne({
        district: district,
      });

      if (isDistrict) {
        const updatedHotel = await Hotel.findByIdAndUpdate(
          isDistrict.id,
          { $push: { hotels: newHotel } },
          { new: true }
        );
        if (updatedHotel) {
          return res.status(200).json(updatedHotel);
        }
      } else {
        const updatedHotel = await new Hotel({
          district: district,
          hotels: newHotel,
        });
        const hotel = await updatedHotel.save();
        return res.status(200).json(hotel);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[GET] /hotel
  async getHotel(req, res) {
    try {
      const data = await Hotel.find({});
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
}

module.exports = new HotelController();
