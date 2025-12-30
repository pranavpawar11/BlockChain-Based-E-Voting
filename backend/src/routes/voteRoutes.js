const express = require('express');
const router = express.Router();
const { castVote, getResults, checkVoteStatus } = require('../controllers/voteController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, castVote);
router.get('/results/:electionId', protect, getResults);
router.get('/status/:electionId', protect, checkVoteStatus);

module.exports = router;