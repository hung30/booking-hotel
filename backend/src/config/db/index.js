const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@hung.mdkhdq2.mongodb.net/?retryWrites=true&w=majority&appName=Hung`
    );
    console.log("Connect successfully");
  } catch (error) {
    console.log("Connect fail");
  }
}

module.exports = { connect };
