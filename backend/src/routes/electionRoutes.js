const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createElection,
  updateElection,
  deleteElection,
  getElections,
  getActiveElections,
  toggleElectionStatus,
  toggleResultsPublished,
  getElectionVoters,
  getAllElectionVoters,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates
} = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.put('/:id/toggle', protect, adminOnly, toggleElectionStatus);
router.put('/:id/toggle-results', protect, adminOnly, toggleResultsPublished);
// router.get('/:id/voters', protect, adminOnly, getElectionVoters);
router.get('/:id/voters', protect, adminOnly, getAllElectionVoters);
router.delete('/:id', protect, adminOnly, deleteElection);
router.get('/', protect, getElections);
router.get('/active', protect, getActiveElections);
router.post('/candidates', protect, adminOnly, upload.single('photo'), addCandidate);
router.put('/candidates/:id', protect, adminOnly, upload.single('photo'), updateCandidate);
router.delete('/candidates/:id', protect, adminOnly, deleteCandidate);
router.get('/:electionId/candidates', protect, getCandidates);

module.exports = router;