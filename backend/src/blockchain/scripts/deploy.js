const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

async function main() {
  console.log('🔨 Compiling contract...');
  
  const contractPath = path.join(__dirname, '../contracts/Voting.sol');
  const source = fs.readFileSync(contractPath, 'utf8');
  
  const input = {
    language: 'Solidity',
    sources: {
      'Voting.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
    output.errors.forEach(err => {
      console.log(err.formattedMessage);
    });
    if (output.errors.some(err => err.severity === 'error')) {
      throw new Error('Compilation failed');
    }
  }

  const contract = output.contracts['Voting.sol'].Voting;
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  console.log('✅ Compilation successful!');
  console.log('📡 Connecting to Ganache...');

  let provider, signer;
  
  try {
    provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
    signer = provider.getSigner(0);
  } catch (error) {
    provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    signer = await provider.getSigner(0);
  }
  
  const signerAddress = await signer.getAddress();
  console.log('👤 Deployer address:', signerAddress);

  console.log('🚀 Deploying contract...');
  
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const votingContract = await factory.deploy();
  await votingContract.deployed();

  const address = votingContract.address;
  
  console.log('\n✅ CONTRACT DEPLOYED SUCCESSFULLY!');
  console.log('📋 Contract Address:', address);
  console.log('\n📝 COPY THIS TO YOUR .env FILE:');
  console.log(`CONTRACT_ADDRESS=${address}`);
  
  const buildDir = path.join(__dirname, '../build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(buildDir, 'Voting.json'),
    JSON.stringify({ abi, bytecode, address }, null, 2)
  );
  
  console.log('💾 Contract artifacts saved to src/blockchain/build/');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });