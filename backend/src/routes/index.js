const newsRouter = require("./news");
const authRouter = require("./auth");
const hotelRouter = require("./hotel");
const userRouter = require("./user");
const bookingRouter = require("./booking");

function route(app) {
  app.use("/booking", bookingRouter);

  app.use("/auth", authRouter);

  app.use("/news", newsRouter);

  app.use("/hotel", hotelRouter);

  app.use("/user", userRouter);
}

module.exports = route;
