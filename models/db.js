const mongoose = require("mongoose");

mongoose
  .connect(process.env.DataBase)
  .then(() => {
    console.log("DB Ready To Use");
  })
  .catch((err) => {
    console.log(err);
  });
