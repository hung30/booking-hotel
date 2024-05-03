const User = require("../models/User");
const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");

class AuthController {
  // [POST] /register
  async register(req, res) {
    const salt = await brcypt.genSalt(10);
    console.log(req.body.password);
    const hashed = await brcypt.hash(req.body.password, salt);
    try {
      const validUser = await User.findOne({
        username: req.body.username,
      });
      if (validUser) {
        return res.status(401).json({
          message: "Tai khoan da ton tai",
        });
      }
      const newUser = new User({
        username: req.body.username,
        password: hashed,
        telephone: req.body.telephone,
        email: req.body.email,
        //save to DB
      });
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // [POST] /login
  async login(req, res) {
    try {
      const user = await User.findOne({
        username: req.body.username,
      }).exec();
      if (!user) {
        return res.status(404).json({
          message: "Tai khoan sai",
        });
      }
      const validPassword = await brcypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json({
          message: "Mat khau sai",
        });
      }
      if (user && validPassword) {
        const token = jwt.sign(
          { id: user._id.toString(), admin: user.admin, name:user.username },
          process.env.JWT_KEY
        );
        return res.status(200).json({
          message: "thanh cong",
          token: token,
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[POST] /logout

  logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({
      message: "Dang xuat thanh cong",
    });
  }

  //[POST] /forgot-password
  async forgotPassword(req, res) {
    try {
      const isUser = await User.findOne({
        username: req.body.username,
        telephone: req.body.telephone,
      });
      if (!isUser) {
        return res.status(401).json({
          message: "Nhap sai tai khoan hoac so dien thoai",
        });
      }
      const salt = await brcypt.genSalt(10);
      const hashed = await brcypt.hash(req.body.password, salt);
      const changePassword = await User.findByIdAndUpdate(
        isUser.id,
        {
          password: hashed,
        },
        { new: true }
      );
      if (changePassword) {
        return res.status(200).json(changePassword);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //[GET] /muahang
  async muahang(req, res) {
    const token = req.cookies.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    const id = data.id;
    try {
      const data = await User.findById(id).exec();
      if (data) {
        res.json({
          message: "thanh cong",
          id: data.id.toString(),
          username: data.username,
          telephone: data.telephone,
          email: data.email,
        });
      } else {
        res.json({
          message: "that bai",
        });
      }
    } catch (err) {
      // console.log(err);
      res.status(500).json(err);
    }
  }
}

module.exports = new AuthController();
