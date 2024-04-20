const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/AuthController");
const middleWareController = require("../app/controllers/MiddleWareController.js");

router.post("/logout", authController.logout);
router.get("/all-cookies", (req, res) => {
  const allCookies = req.cookies;
  console.log(allCookies);
  res.send(allCookies);
});
router.post("/forgot-password", authController.forgotPassword);
router.get(
  "/muahang",
  middleWareController.isLogin,
  middleWareController.isAdmin,
  authController.muahang
);
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
