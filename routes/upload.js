const router = require("express").Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const path = require("path");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: process.env.aws_region,
});

//aws使用設定
const s3 = new AWS.S3();

//ファイルバリデーションのミドルウェア
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.aws_bucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        `${
          new Date().getMonth().toString() + new Date().getDate().toString()
        }-${file.originalname}`
      );
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
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
