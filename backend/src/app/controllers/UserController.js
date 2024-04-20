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
      console.log(token);
      const idUser = await jwt.verify(token, process.env.JWT_KEY);
      console.log(idUser);
      const user = await User.findById(idUser.id);
      console.log(user);

      if (!user) {
        return res.status(404).json(err);
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

module.exports = new UserController();
