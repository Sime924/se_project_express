const router = require("express").Router();
const {
  createItem,
  likeItem,
  deleteLike,
} = require("../controllers/clothingitems");

router.get("/items", () => console.log("GET items"));
router.post("/", createItem);
router.delete("/items/:itemId", () => console.log("DELETE items"));

router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", deleteLike);

module.exports = router;
