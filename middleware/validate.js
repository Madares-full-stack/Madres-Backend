const mongoose = require('mongoose');

const validateSubject = (req, res, next) => {
  const { name, teacher } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res
      .status(400)
      .json({ success: false, message: 'name is required and must be a string' });
  }

  if (!teacher) {
    return res
      .status(400)
      .json({ success: false, message: 'teacher (User ref) is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(teacher)) {
    return res
      .status(400)
      .json({ success: false, message: 'teacher must be a valid MongoDB ObjectId' });
  }

  next();
};

module.exports = { validateSubject };