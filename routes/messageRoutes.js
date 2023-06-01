const { addMessage, getAllMessages } = require("../controllers/messageController");

const router = require("express").Router();


router.post("/add",  addMessage);
router.post("/getmsgs",  getAllMessages);
// router.post("/login",  loginUser);
// router.get("/:userId",  getAllUsers);
// router.get("/single/:userId",  getSingleUser);

module.exports = router;