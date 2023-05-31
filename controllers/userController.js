const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { isValidObjectId } = require("mongoose");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isUsernameTaken = await User.findOne({ username });
    const isAlreadyExists = await User.findOne({ email });

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
      const newUser = new User({
        username,
        email,
        password: cryptoJs.AES.encrypt(password, process.env.PASS_SEC),
      });

      newUser.save();
      res.status(200).json({
        status: "success",
        message: "Registration Successful Login to continue",
      });
    }
  } catch (err) {
    console.log(err);
  }
 
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const isExistingUser = await User.findOne({ username });
  !isExistingUser && res.status(401).json("Wrong Credentials !");
  const hashedGuy = cryptoJs.AES.decrypt(
    isExistingUser.password,
    process.env.PASS_SEC
  );
  const decryptedPassword = hashedGuy.toString(cryptoJs.enc.Utf8);

  if (decryptedPassword !== password) {
    res.status(401).json("Wrong Credentials!");
  } else {
    const accessToken = jwt.sign(
      {
        id: isExistingUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const { password, ...others } = isExistingUser._doc;

    res.status(200).json({
      status: "success",
      message: "Logged in successfully !",
      data: { ...others, accessToken },
    });
  }
};
module.exports = {
  createUser,
  loginUser,
};
