const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingUsers,
  verifyUser,
  rejectUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/pending', protect, adminOnly, getPendingUsers);
router.put('/verify/:userId', protect, adminOnly, verifyUser);
router.put('/reject/:userId', protect, adminOnly, rejectUser);

module.exports = router;