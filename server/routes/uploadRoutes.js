const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateToken = require('../middleware/auth');

// File upload settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /\.(jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|apk)$/i;
  const mimetypes = /image\/(jpeg|png|gif)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation|application\/x-rar-compressed|application\/zip|application\/vnd\.android\.package-archive/i;
  const isFileTypeValid = filetypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = mimetypes.test(file.mimetype);
  if (isFileTypeValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// File Uploads
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(201).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    filepath: req.file.path
  });
});

// Endpoint to upload general files
router.post('/upload/general', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path
  });
});

module.exports = router;
