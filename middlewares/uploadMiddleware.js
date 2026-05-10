const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // ← يحفظ في مجلد uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video') ||
    file.mimetype.startsWith('application/pdf') ||
    file.mimetype.startsWith('image')
  ) {
    cb(null, true);
  } else {
    cb(new ApiError('Unsupported file format', 400), false);
  }
};

const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadLessonFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);