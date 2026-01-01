const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const VoteRecord = require('../models/VoteRecord');
const User = require('../models/User');
exports.createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    
    const election = await Election.create({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, isActive } = req.body;
    
    const election = await Election.findByIdAndUpdate(
      id,
      { title, description, startDate, endDate, isActive },
      { new: true, runValidators: true }
    );

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    
    const election = await Election.findByIdAndDelete(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    await Candidate.deleteMany({ electionId: id });

    res.json({ message: 'Election and associated candidates deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    
    const electionsWithStatus = elections.map(election => ({
      ...election.toObject(),
      status: election.getStatus()
    }));
    
    res.json(electionsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveElections = async (req, res) => {
  try {
    const elections = await Election.find({ isActive: true }).sort({ createdAt: -1 });
    
    const now = new Date();
    const activeElections = elections.filter(election => {
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);
      return now >= start && now <= end;
    }).map(election => ({
      ...election.toObject(),
      status: election.getStatus()
    }));
    
    res.json(activeElections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleElectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    election.isActive = !election.isActive;
    await election.save();

    res.json({
      message: `Election ${election.isActive ? 'activated' : 'deactivated'} successfully`,
      election: {
        ...election.toObject(),
        status: election.getStatus()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleResultsPublished = async (req, res) => {
  try {
    const { id } = req.params;
    
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    election.resultsPublished = !election.resultsPublished;
    await election.save();

    res.json({
      message: `Results ${election.resultsPublished ? 'published' : 'hidden'} successfully`,
      election: {
        ...election.toObject(),
        status: election.getStatus()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getElectionVoters = async (req, res) => {
  try {
    const { id } = req.params;
    
    const voteRecords = await VoteRecord.find({ electionId: id })
      .populate('userId', 'name email walletAddress')
      .sort({ timestamp: -1 });

    const voters = voteRecords.map(record => ({
      _id: record.userId._id,
      name: record.userId.name,
      email: record.userId.email,
      walletAddress: record.userId.walletAddress,
      transactionHash: record.transactionHash,
      blockNumber: record.blockNumber,
      votedAt: record.timestamp
    }));

    res.json({
      totalVotes: voters.length,
      voters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateCandidateId = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit number
};

exports.addCandidate = async (req, res) => {
  try {
    const { name, party, manifesto, electionId } = req.body;

    const candidate = await Candidate.create({
      name,
      party,
      manifesto,
      photo: req.file ? req.file.filename : '',
      electionId,
      candidateId: generateCandidateId()
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, party, manifesto, candidateId } = req.body;
    
    const updateData = { name, party, manifesto, candidateId };
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ electionId }).sort({ candidateId: 1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this NEW function after getElectionVoters
exports.getAllElectionVoters = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all verified users (potential voters)
    const allUsers = await User.find({ 
      role: 'voter',
      isVerified: true 
    }).select('name email walletAddress isVerified createdAt');
    
    // Get vote records for this election
    const voteRecords = await VoteRecord.find({ electionId: id });
    
    // Create a map of users who voted
    const votedUserIds = new Set(voteRecords.map(record => record.userId.toString()));
    
    // Combine data
    const voters = allUsers.map(user => {
      const userVote = voteRecords.find(record => record.userId.toString() === user._id.toString());
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        hasVoted: votedUserIds.has(user._id.toString()),
        verifiedAt: user.createdAt,
        transactionHash: userVote?.transactionHash || null,
        blockNumber: userVote?.blockNumber || null,
        votedAt: userVote?.timestamp || null
      };
    });
    
    // Calculate stats
    const totalVoters = voters.length;
    const votedCount = voters.filter(v => v.hasVoted).length;
    const notVotedCount = totalVoters - votedCount;
    
    res.json({
      totalVoters,
      votedCount,
      notVotedCount,
      voters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};