const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/madares");
  console.log("DB Ready To Use");
};

module.exports = connectDB;
