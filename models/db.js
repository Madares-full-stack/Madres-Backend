const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI );
  console.log("DB Ready To Use");
};

module.exports = connectDB;
