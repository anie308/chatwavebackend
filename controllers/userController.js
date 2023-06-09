const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("../cloud");


const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isUsernameTaken = await Users.findOne({ username });
    const isAlreadyExists = await Users.findOne({ email });

    if (isUsernameTaken)
      return res.status(400).json({
        status: "error",
        message: "Username already exists pick another one",
      });
    else if (isAlreadyExists)
      return res.status(400).json({
        status: "error",
        message: "User already Exists, please login to continue",
      });
    else {
      const newUser = new Users({
        username,
        email,
        password: cryptoJs.AES.encrypt(password, process.env.PASS_SEC),
      });

      newUser.save();

      res.status(200).json({
        status: "success",
        message: "Registration Successful Login to continue",
        data: newUser
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async(req, res)=> {
  try{
    const {userId} = req.params
    const { description} = req.body
    const { file } = req;
    let profilePicture;

    if (file) {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        file.path
      );
      profilePicture = { url, public_id };

          // newLesson.lessons.lesson_video = { url, public_id };
    }
    console.log(profilePicture)

    const updatedUser = await Users.findByIdAndUpdate(userId, {
      description,
      profilePicture
    });

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: updatedUser
    });

    
  }catch(err){

  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const isExistingUser = await Users.findOne({ username });
  if (!isExistingUser) {
    return res.status(401).json({ error: "User not found" });
  }

  const hashedGuy = cryptoJs.AES.decrypt(
    isExistingUser.password,
    process.env.PASS_SEC
  );
  const decryptedPassword = hashedGuy.toString(cryptoJs.enc.Utf8);

  if (decryptedPassword !== password) {
    return res.status(401).json({
      error: "Wrong Credentials!",
    });
  }

  const accessToken = jwt.sign(
    {
      id: isExistingUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  const { password: _, ...others } = isExistingUser._doc;

  return res.status(200).json({ ...others, accessToken });
};

const getAllUsers = async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId))
    return res.status(401).json({ error: "Invalid request" });

  const users = await Users.find({ _id: { $ne: userId } }).select([
    "email",
    "username",
    "avatar",
    "id",
  ]);
  res.status(200).json({
    status: "success",
    message: "All users",
    data: users,
  });
};

const getSingleUser = async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId))
    return res.status(401).json({ error: "Invalid request" });

  const user = await Users.findById(userId).select([
    "email",
    "username",
    "avatar",
    "id",
  ]);
  if (!user) return res.status(404).json({ error: "User not found!" });

  res.status(200).json({
    status: "success",
    message: "Single user",
    data: user,
  });
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUser
};
