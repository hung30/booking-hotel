const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController.js");
const middleWareController = require("../app/controllers/MiddleWareController.js");

router.get(
  "/",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  userController.getAllUser
);
router.get("/get-user", middleWareController.isLogin, userController.getUser);
module.exports = router;
