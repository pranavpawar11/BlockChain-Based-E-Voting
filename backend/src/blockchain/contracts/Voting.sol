// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Vote {
        uint256 electionId;
        uint256 candidateId;
        address voter;
        uint256 timestamp;
    }

    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(uint256 => uint256)) public voteCounts;
    Vote[] public votes;

    event VoteCast(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        address indexed voter,
        uint256 timestamp
    );

    function castVote(uint256 _electionId, uint256 _candidateId) public {
        require(!hasVoted[_electionId][msg.sender], "Already voted");
        
        hasVoted[_electionId][msg.sender] = true;
        voteCounts[_electionId][_candidateId]++;
        
        votes.push(Vote({
            electionId: _electionId,
            candidateId: _candidateId,
            voter: msg.sender,
            timestamp: block.timestamp
        }));

        emit VoteCast(_electionId, _candidateId, msg.sender, block.timestamp);
    }

    function getVoteCount(uint256 _electionId, uint256 _candidateId) public view returns (uint256) {
        return voteCounts[_electionId][_candidateId];
    }

    function checkIfVoted(uint256 _electionId, address _voter) public view returns (bool) {
        return hasVoted[_electionId][_voter];
    }

    function getTotalVotes() public view returns (uint256) {
        return votes.length;
    }
}