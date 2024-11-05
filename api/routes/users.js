const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true } // Added runValidators to ensure proper validation
      );
      if (!updatedUser) {
        return res.status(404).json("User not found!"); // Handle case where user does not exist
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Error updating user", error: err });
    }
  } else {
    res.status(403).json("You can update only your account!"); // Changed to 403 Forbidden
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json("User not found!"); // Handle case where user does not exist
      }
      await Post.deleteMany({ username: user.username });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json({ message: "Error deleting user", error: err });
    }
  } else {
    res.status(403).json("You can delete only your account!"); // Changed to 403 Forbidden
  }
});

// GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found!"); // Handle case where user does not exist
    }
    const { password, ...others } = user._doc; // Omit password from response
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user", error: err });
  }
});

module.exports = router;
