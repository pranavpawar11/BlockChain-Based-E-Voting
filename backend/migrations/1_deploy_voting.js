const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  deployer.deploy(Voting).then(() => {
    console.log("✅ Voting contract deployed to:", Voting.address);
    console.log("📋 Copy this address to your .env file as CONTRACT_ADDRESS");
  });
};