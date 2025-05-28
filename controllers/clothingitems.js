const { SERVER_MALFUNCTION } = require("../utils/errors");

const clothingItem = require("../models/clothingitems");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(SERVER_MALFUNCTION).send({ message: "Error from createItem" });
    });
};

const getItems = async (req, res) => {
  try {
    const items = await clothingItem.find({});
    res.send(items);
  } catch (err) {
    res.status(500).send({ message: SERVER_MALFUNCTION, error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await clothingItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.send({ message: "Item deleted", item: deletedItem });
  } catch (err) {
    res.status(500).send({ message: SERVER_MALFUNCTION, error: err.message });
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
    res.send(updatedItem);
  } catch (err) {
    res.status(500).send({ message: SERVER_MALFUNCTION, error: err.message });
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
    res.send(updatedItem);
  } catch (err) {
    res.status(500).send({ message: SERVER_MALFUNCTION, error: err.message });
  }
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
};
