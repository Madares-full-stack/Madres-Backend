const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const roleModel = require("../models/roleSchema");

const googleLogin = async (req, res) => {
  try {
    const { idToken, roleId } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "idToken is required." });
    }


    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    const { email, name, sub: googleId } = googleRes.data;

    if (!email) {
      return res.status(401).json({ success: false, message: "Invalid Google token." });
    }

    let user = await User.findOne({ email }).populate("role");

    if (!user) {
      
      if (!roleId) {
        return res.status(400).json({
          success: false,
          message: "First Google login requires roleId.",
        });
      }
      const roleDoc = await roleModel.findById(roleId);
      if (!roleDoc) {
        return res.status(404).json({ success: false, message: "Role not found." });
      }
      user = await User.create({ name, email, googleId, password: null, role: roleDoc._id });
      user = await user.populate("role");
    } else if (!user.googleId) {
     
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role.name },
    });
  } catch (err) {
    if (err.response?.status === 400) {
      return res.status(401).json({ success: false, message: "Invalid or expired Google token." });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { googleLogin };