const multer = require('multer');
const ApiError = require('../utils/apiError');

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video') || file.mimetype.startsWith('application/pdf') || file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Unsupported file format', 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });

exports.uploadLessonFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);