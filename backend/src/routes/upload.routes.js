const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadSingle } = require('../controllers/upload.controller');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', auth, upload.single('file'), uploadSingle);

module.exports = router;
