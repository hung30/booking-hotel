const User = require("../models/User");
const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");
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
      const userId = req.params.id;
      const users = await User.find({ _id: { $ne: req.params.id } });
      const isUserNameExist = users.some(
        (user) => user.username === req.body.username
      );
      if (isUserNameExist) {
        return res.status(400).json({
          message: "Username đã tồn tại",
        });
      }
      const user = await User.findByIdAndUpdate(
        userId,
        {
          username: req.body.username,
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

  //[PUT] /user/change-password
  async changePassword(req, res) {
    try {
      const salt = await brcypt.genSalt(10);
      const hashed = await brcypt.hash(req.body.password, salt);
      const user = await User.findByIdAndUpdate(req.params.id, {
        password: hashed,
      });
      if (!user) {
        return res.json({
          message: "Cập nhật thất bại",
        });
      }
      return res.status(200).json({
        message: "Cập nhật thành công",
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
