const roleModel = require("../models/roleSchema");

const createRole = async (req, res) => {
  try {
    const { name} = req.body;
    const exists = await roleModel.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    } else {
      const newRole = new roleModel({
        name,
      });
      const saved = await newRole.save();
      res.status(201).json({
        success: true,
        message: "Role create successfully",
        role: saved,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getRole = async (req, res) => {
  try {
    const result = await roleModel.find({});
    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No role was found" });
    }
    return res.status(200).json({ success: true, role: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createRole, getRole };
