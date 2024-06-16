const express = require("express");
const morgan = require("morgan");

const route = require("./routes");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//use process.env
require("dotenv").config();

//connect to DB
db.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*", // Đổi lại thành địa chỉ của trang web của bạn
  credentials: true, // Cho phép gửi cookie
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes Init
route(app);

app.listen(port, () => {
  console.log(`App listening at  http://127.0.0.1:${port}`);
});
