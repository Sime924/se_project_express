const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingitems");
const { PAGE_NOT_FOUND } = require("../utils/errors");
const NotFoundErr = require("../errors/not-found-err");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use((req, res, next) => {
  next(new NotFoundErr("Requested resource not found"));
});

module.exports = router;
