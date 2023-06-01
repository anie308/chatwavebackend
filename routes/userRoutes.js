const { createUser, loginUser, getAllUsers, getSingleUser } = require("../controllers/userController");

const router = require("express").Router();


router.post("/signup",  createUser);
router.post("/login",  loginUser);
router.get("/:userId",  getAllUsers);
router.get("/single/:userId",  getSingleUser);

module.exports = router;

