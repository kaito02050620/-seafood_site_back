const router = require("express").Router();
const multer = require("multer");
const path = require("path");

//ファイルの保存先、一意なファイル名に変更
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

//ファイルバリデーションのミドルウェア
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb("画像ファイルではないので投稿出来ません");
    }
  },
}).single("file");

//画像をアップロード
router.post("/", upload, (req, res) => {
  try {
    return res.status(200).json("画像アップロードに成功しました");
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
