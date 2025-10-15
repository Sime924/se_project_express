const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
} = require("../controllers/clothingitems");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateId, deleteItem);

router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, deleteLike);

module.exports = router;
