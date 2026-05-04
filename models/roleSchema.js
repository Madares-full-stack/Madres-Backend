const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["admin", "teacher", "parent", "student"],
  }
});

module.exports = mongoose.model("Role", roleSchema);