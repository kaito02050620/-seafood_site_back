const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//ユーザー新規登録
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//ユーザーログイン
router.post("/login", async (req, res) => {
  try {
    //ユーザー照合
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("ユーザーが見つかりません");

    //パスワード照合
    const compared = await bcrypt.compare(req.body.password, user.password);
    if (!compared) return res.status(400).json("パスワードが一致しません");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
