const { ethers } = require('ethers');

const VOTING_ABI = [
  "function castVote(uint256 _electionId, uint256 _candidateId) public",
  "function getVoteCount(uint256 _electionId, uint256 _candidateId) public view returns (uint256)",
  "function checkIfVoted(uint256 _electionId, address _voter) public view returns (bool)",
  "function getTotalVotes() public view returns (uint256)",
  "event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter, uint256 timestamp)"
];

class BlockchainService {
  constructor() {
    try {
      this.provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545');
    } catch (error) {
      this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545');
    }
    
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.privateKey = process.env.PRIVATE_KEY;
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.contract = new ethers.Contract(this.contractAddress, VOTING_ABI, this.wallet);
  }

  async castVote(electionId, candidateId) {
    try {
      console.log(`\n🗳️  Casting vote - Election: ${electionId}, Candidate: ${candidateId}`);
      
      const tx = await this.contract.castVote(electionId, candidateId);
      console.log(`📝 Transaction Hash: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Vote confirmed in Block: ${receipt.blockNumber}`);
      console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()}`);
      
      if (receipt.events && receipt.events.length > 0) {
        const event = receipt.events.find(e => e.event === 'VoteCast');
        if (event) {
          console.log(`📡 Event Emitted: VoteCast`);
          console.log(`   - Voter: ${event.args.voter}`);
          console.log(`   - Timestamp: ${new Date(Number(event.args.timestamp) * 1000).toISOString()}`);
        }
      }
      
      return {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Blockchain vote error:', error.message);
      throw error;
    }
  }

  async getVoteCount(electionId, candidateId) {
    try {
      const count = await this.contract.getVoteCount(electionId, candidateId);
      return Number(count);
    } catch (error) {
      console.error('Error getting vote count:', error.message);
      throw error;
    }
  }

  async checkIfVoted(electionId, voterAddress) {
    try {
      const hasVoted = await this.contract.checkIfVoted(electionId, voterAddress);
      return hasVoted;
    } catch (error) {
      console.error('Error checking vote status:', error.message);
      throw error;
    }
  }

  async getTotalVotes() {
    try {
      const total = await this.contract.getTotalVotes();
      return Number(total);
    } catch (error) {
      console.error('Error getting total votes:', error.message);
      throw error;
    }
  }
}

module.exports = new BlockchainService();