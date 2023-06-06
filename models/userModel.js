const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description:{
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: Object,
      url: {
        type: URL,
      },
      public_id: {
        type: String,
      },
    },
    isAvatarSet:{
      type: Boolean,
      default: false
    },
    avatar: {
      type: Object,
      url: {
        type: URL,
      },
      public_id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
