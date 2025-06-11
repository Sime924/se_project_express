const User = require("../models/user");
const bcrypt = require("bcrypt");

const {
  PAGE_NOT_FOUND,
  REQUEST_COMPLETED_SUCCESSFULLY,
  YOUR_DATA_IS_CREATED,
  SERVER_MALFUNCTION,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_ACCESS,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_MALFUNCTION)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash });
    })
    .then((user) => {
      delete user.password;
      res.status(YOUR_DATA_IS_CREATED).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(SERVER_MALFUNCTION).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(REQUEST_COMPLETED_SUCCESSFULLY).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(PAGE_NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(SERVER_MALFUNCTION).send({ message: err.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password);
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED_ACCESS)
        .send({ message: "Incorrect email or password" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid ID" });
      }
      return res
        .status(SERVER_MALFUNCTION)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
