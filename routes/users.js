const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);
router.post("/", createUser);

module.exports = router;
