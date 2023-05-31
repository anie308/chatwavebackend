const { createUser, loginUser, getAllUsers } = require("../controllers/userController");

const router = require("express").Router();


router.post("/signup",  createUser);
router.post("/login",  loginUser);
router.post("/all-users",  getAllUsers);

module.exports = router;

