const ApiError = require('../utils/apiError');

const validatorMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((err) => err.message);
      return next(new ApiError(errors, 400));
    }
    next();
  };
};

module.exports = validatorMiddleware;