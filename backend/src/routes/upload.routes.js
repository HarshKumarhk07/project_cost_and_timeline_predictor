// src/routes/upload.routes.js
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { uploadSingle } = require('../controllers/upload.controller');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
// resolve to absolute path relative to project root
const uploadPath = path.resolve(process.cwd(), UPLOAD_DIR);

// ensure upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});

const upload = multer({ storage });

router.post('/', auth, upload.single('file'), uploadSingle);

module.exports = router;
