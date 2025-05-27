const router = require("express").Router();
const { createItem } = require("../controllers/clothingitems");

router.get("/items", () => console.log("GET items"));
router.post("/", createItem);
router.delete("/items/:itemId", () => console.log("DELETE items"));

module.exports = router;
