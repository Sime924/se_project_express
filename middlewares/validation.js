const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": "The 'weather' field must be filled",
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name'field must be filled in",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'avatar' field must be filled in",
      "string.uri": "the 'avatar' field must be a valid Url",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
      "string.email": "The 'email' field must be a valid email",
    }),
    password: Joi.string().required().min(8).max(30).messages({
      "string.empty": "The 'password' field must be filled",
      "string.min": "The minimun length of the 'password' field is 8 ",
      "string.max": "The maximum length of the 'password' field is 30",
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled",
      "string.email": "the 'email' field must be a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled",
      "string.min": "the minimum length of the 'password' field is 8",
      "string.max": "The maximum length of the 'password' field is 30",
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": "The 'itemId' field must be filled in",
      "string.hex":
        "The 'itemId' field must only contain hexadecimal characters",
      "string.length": "the 'itemId' field must be 24 characters in length",
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateId,
};
