const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class MiddleWareController {
  // check login
  async isLogin(req, res, next) {
    try {
      const token = await req.cookies.token;
      if (!token) {
        return res.json({
          message: "Chua dang nhap",
        });
      }
      next();
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  //check admin
  async isAdmin(req, res, next) {
    try {
      const token = await req.cookies.token;
      const idUser = await jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(idUser.id);
      if (user.admin) {
        next();
      } else {
        res.status(401).json({
          message: "Ban khong co quyen admin",
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // Thiết lập multer để lưu trữ tệp được tải lên vào thư mục 'uploads'
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../..", "public", "uploads")); // Đường dẫn đích để lưu trữ tệp
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + file.originalname); // Tên tệp sau khi lưu trữ
    },
  });

  upload = multer({ storage: this.storage });
}

module.exports = new MiddleWareController();
