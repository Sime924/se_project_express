const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const {
  REQUEST_COMPLETED_SUCCESSFULLY,
  YOUR_DATA_IS_CREATED,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))

    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(YOUR_DATA_IS_CREATED).send(userResponse);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      if (err.code === 11000) {
        return next(new ConflictError("User already exists"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(REQUEST_COMPLETED_SUCCESSFULLY).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
