const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { register, registerAdmin, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/register', upload.single('idDocument'), register);
router.post('/register-admin', upload.single('idDocument'), registerAdmin);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;