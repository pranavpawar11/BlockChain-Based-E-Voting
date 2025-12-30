const VoteRecord = require('../models/VoteRecord');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const blockchainService = require('../blockchain/blockchainService');

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admins cannot vote. Only voters can participate in elections.' 
      });
    }
    
    if (!req.user.isVerified) {
      return res.status(403).json({ 
        message: 'Your account is not verified. Please wait for admin approval.' 
      });
    }
    
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return res.status(400).json({ message: 'Election is not active' });
    }

    if (!election.isActive) {
      return res.status(400).json({ message: 'This election has been deactivated' });
    }

    const existingVote = await VoteRecord.findOne({
      userId: req.user._id,
      electionId
    });

    if (existingVote) {
      return res.status(400).json({ message: 'Already voted in this election' });
    }

    const candidate = await Candidate.findOne({ electionId, candidateId });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const blockchainResult = await blockchainService.castVote(
      parseInt(electionId.toString().slice(-8), 16) % 1000000,
      candidateId
    );

    const voteRecord = await VoteRecord.create({
      userId: req.user._id,
      electionId,
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber
    });

    res.status(201).json({
      message: 'Vote cast successfully',
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber,
      voteRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (!election.resultsPublished && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Results have not been published yet. Please check back later.' 
      });
    }
    
    const candidates = await Candidate.find({ electionId });
    const results = [];

    for (const candidate of candidates) {
      const voteCount = await blockchainService.getVoteCount(
        parseInt(electionId.toString().slice(-8), 16) % 1000000,
        candidate.candidateId
      );
      
      results.push({
        candidateId: candidate.candidateId,
        name: candidate.name,
        party: candidate.party,
        photo: candidate.photo,
        votes: voteCount
      });
    }

    results.sort((a, b) => b.votes - a.votes);
    res.json({
      resultsPublished: election.resultsPublished,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkVoteStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    const voteRecord = await VoteRecord.findOne({
      userId: req.user._id,
      electionId
    });

    res.json({
      hasVoted: !!voteRecord,
      voteRecord: voteRecord || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};