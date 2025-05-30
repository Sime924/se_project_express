const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingitems");
const { PAGE_NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use((req, res) =>
  res.status(PAGE_NOT_FOUND).send({ message: "send 404 ERROR" })
);

module.exports = router;
