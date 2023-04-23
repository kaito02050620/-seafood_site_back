const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//ユーザー削除
router.delete("/:id", async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  try {
    await User.deleteOne({ _id: user._id });
    await Post.deleteMany({ userId: user._id });
    return res.status(200).json("ユーザー情報、これまでの投稿を削除しました。");
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
