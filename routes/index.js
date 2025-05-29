const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingitems");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use((req, res) => {
  return res.status(404).send({ message: "send 404 ERROR" });
});

module.exports = router;
