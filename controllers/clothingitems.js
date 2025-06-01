const {
  SERVER_MALFUNCTION,
  BAD_REQUEST_STATUS_CODE,
} = require("../utils/errors");

const clothingItem = require("../models/clothingitems");
const Item = require("../models/clothingitems");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({
          message: "A Bad request was made",
        });
      }
      return res.status(SERVER_MALFUNCTION).send({ message: "Server error" });
    });
};

const getItems = async (req, res) => {
  try {
    const items = await clothingItem.find({});
    return res.send(items);
  } catch (err) {
    return res
      .status(SERVER_MALFUNCTION)
      .send({ message: "An error has occured on the server" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await clothingItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).send({ message: "Item not found" });
    }

    return res.send({ message: "Item deleted", item: deletedItem });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid ID format" });
    }
    return res
      .status(500)
      .send({ message: SERVER_MALFUNCTION, error: err.message });
  }
};

const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userID = req.user._id;

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userID } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "Item not found" });
    }
    return res.send(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST_STATUS_CODE)({
        message: " Invalid ID fomat",
      });
    }
    return res
      .status(500)
      .send({ message: SERVER_MALFUNCTION, error: err.message });
  }
};

const deleteLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await clothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "Item not found" });
    }
    return res.send(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid Id format" });
    }
    return res
      .status(500)
      .send({ message: SERVER_MALFUNCTION, error: err.message });
  }
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
};
