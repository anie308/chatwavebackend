const { createUser, loginUser, getAllUsers, getSingleUser, updateUser } = require("../controllers/userController");
const multer = require("../middlewares/multer");

const router = require("express").Router();


router.post("/signup",    createUser);
router.put("/update/:userId", multer.single('profilePicture'),  updateUser);
router.post("/login",  loginUser);
router.get("/:userId",  getAllUsers);
router.get("/single/:userId",  getSingleUser);

module.exports = router;

