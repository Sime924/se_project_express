const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
} = require("../controllers/clothingitems");

router.get("/items", getItems);
router.post("/", createItem);
router.delete("/items/:itemId", deleteItem);

router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", deleteLike);

module.exports = router;
