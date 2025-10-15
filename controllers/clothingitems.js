const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");

const clothingItem = require("../models/clothingitems");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation failed"));
      }
      return next(err);
    });
};

const getItems = async (req, res, next) => {
  try {
    const items = await clothingItem.find({});
    return res.send(items);
  } catch (err) {
    return next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await clothingItem.findById(itemId);

    if (!deletedItem) {
      return next(new NotFoundError("Item not found"));
    }

    if (deletedItem.owner.toString() !== req.user._id) {
      return next(new ForbiddenError("Access denied"));
    }

    await clothingItem.findByIdAndDelete(itemId);
    return res.send({ message: "Item deleted", item: deletedItem });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userID = req.user._id;

    const updatedItem = await clothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userID } },
      { new: true }
    );
    if (!updatedItem) {
      return next(new NotFoundError("Item not found"));
    }
    return res.send(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await clothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedItem) {
      return next(new NotFoundError("Item not found"));
    }
    return res.send(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
};
