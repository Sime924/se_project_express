const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;
