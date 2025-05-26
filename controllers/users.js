const User = require("../models/user");
const {
  PAGE_NOT_FOUND,
  REQUEST_COMPLETED_SUCCESSFULLY,
  YOUR_DATA_IS_CREATED,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_MALFUNCTION).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(YOUR_DATA_IS_CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      } else {
        return res.status(SERVER_MALFUNCTION).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.status(REQUEST_COMPLETED_SUCCESSFULLY).send(user))
    .orFail()
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(PAGE_NOT_FOUND).send({ message: "User not found" });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(SERVER_MALFUNCTION).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
