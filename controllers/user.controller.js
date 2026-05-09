const User = require("../models/user.model");
const Role = require("../models/roleSchema");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name").select("-password");
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ success: false, message: "name, email, password, and roleId are required." });
    }
    const roleExists = await Role.findById(roleId);
    if (!roleExists) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }
    const user = await User.create({ name, email, password, role: roleId });
    const populated = await user.populate("role", "name");
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: { id: populated._id, name: populated.name, email: populated.email, role: populated.role.name },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, createUser };