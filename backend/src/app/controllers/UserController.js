const User = require("../models/User");
const jwt = require("jsonwebtoken");

class UserController {
  //[GET] /user
  async getAllUser(req, res) {
    try {
      const users = await User.find();
      if (!users) {
        return res.status(404).json({
          message: "khong tim thay User nao",
        });
      }

      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async getUser(req, res) {
    try {
      const token = await req.cookies.token;
      const idUser = await jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(idUser.id);

      if (!user) {
        return res.status(404).json(err);
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // [PUT] /update-user
  async updateUser(req, res) {
    try {
      const salt = await brcypt.genSalt(10);
      const hashed = await brcypt.hash(req.body.password, salt);

      const userId = await req.params.id;
      const user = await User.findByIdAndUpdate(
        userId,
        {
          username: req.body.username,
          password: hashed,
          email: req.body.email,
          telephone: req.body.telephone,
        },
        { new: true }
      );
      if (!user) {
        return res.json({
          message: "Cap nhat that bai",
        });
      }
      const { password, admin, ...others } = user._doc;
      return res.status(200).json({
        message: "Cap nhat thanh cong",
        others,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[DELETE] /delete-user
  async deleteUser(req, res) {
    try {
      const userId = await req.params.id;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.json({
          message: "Xoa user that bai",
        });
      }
      return res.status(200).json({
        message: "Xoa user thanh cong",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

module.exports = new UserController();
