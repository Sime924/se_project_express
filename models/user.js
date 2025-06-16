const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "An email is required."],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "A valid email is required",
    },
  },
  password: {
    type: String,
    required: [true, "Enter a valid password"],
    select: false,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
    },
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    return Promise.reject(new Error("Incorrect email or password"));
  }
  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    return Promise.reject(new Error("Incorrect email or password"));
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
