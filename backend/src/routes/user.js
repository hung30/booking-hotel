const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/UserController.js");
const middleWareController = require("../app/controllers/MiddleWareController.js");

router.get(
  "/get-all-user",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  userController.getAllUser
);
router.get("/get-user", middleWareController.isLogin, userController.getUser);
router.put(
  "/update-user/:id",
  middleWareController.isLogin,
  userController.updateUser
);
router.delete(
  "/delete-user/:id",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  userController.deleteUser
);
module.exports = router;
