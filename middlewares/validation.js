const { joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCardBody = celebrate({
  body: joi.object().keys({
    name: joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    imageUrl: joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
  }),
});

const validateUserBody = celebrate({
  body: joi.object().keys({
    name: joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name'field must be filled in",
    }),
    avatar: joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'avatar' field must be filled in",
      "string.uri": "the 'avatar' field must be a valid Url",
    }),
  }),
});

const validateAuthentication = celebrate({
  body: joi.object().keys({
    email: joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled",
      "string.email": "the 'email' field must be a valid email",
    }),
    password: joi.string().required().messages({
      "string.empty": "The 'password' field must be filled",
    }),
  }),
});

const validateId = celebrate({
  params: joi.object().keys({
    postId: joi.string().required().alphanum().length(24).messages({
      "string.empty": "The 'postId' field must be filled in",
      "string.alphanum":
        "The 'postId' field must only contain alphanumeric characters",
      "string.length": "the 'postId' field must be 24 characters in length",
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateId,
};
