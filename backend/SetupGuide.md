# Blockchain Ballotbox - Complete Setup Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (local installation)
- Git

## Step-by-Step Setup

### 1. Create Project Structure
```bash
mkdir blockchain-ballotbox
cd blockchain-ballotbox
mkdir backend
cd backend
```

### 2. Initialize Backend
```bash
npm init -y
npm install express mongoose cors jsonwebtoken bcryptjs multer dotenv express-validator ethers @openzeppelin/contracts
npm install --save-dev nodemon hardhat @nomicfoundation/hardhat-toolbox
```

### 3. Initialize Hardhat
```bash
npx hardhat
```
- Select: **Create a JavaScript project**
- Accept all defaults
- Install dependencies: **YES**

### 4. Create Folder Structure
```bash
mkdir src
mkdir src/controllers
mkdir src/routes
mkdir src/models
mkdir src/middleware
mkdir src/blockchain
mkdir src/blockchain/contracts
mkdir src/blockchain/scripts
mkdir uploads
```

### 5. Move Hardhat Files
Move `hardhat.config.js` to root of backend folder (already configured in artifacts)

### 6. Copy All Files
Copy all the artifact files to their respective locations:

**Blockchain:**
- `Voting.sol` → `src/blockchain/contracts/`
- `deploy.js` → `src/blockchain/scripts/`
- `blockchainService.js` → `src/blockchain/`

**Models:**
- `User.js` → `src/models/`
- `Election.js` → `src/models/`
- `Candidate.js` → `src/models/`
- `VoteRecord.js` → `src/models/`

**Controllers:**
- `authController.js` → `src/controllers/`
- `electionController.js` → `src/controllers/`
- `voteController.js` → `src/controllers/`

**Routes:**
- `authRoutes.js` → `src/routes/`
- `electionRoutes.js` → `src/routes/`
- `voteRoutes.js` → `src/routes/`

**Middleware:**
- `auth.js` → `src/middleware/`

**Root:**
- `app.js` → `src/`
- `package.json` → root of backend

### 7. Setup Environment Variables
Create `.env` file in backend root:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/blockchain-ballotbox
JWT_SECRET=mySecretKey123
BLOCKCHAIN_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=
PRIVATE_KEY=
```

### 8. Start MongoDB
Open a new terminal and start MongoDB:
```bash
mongod
```

### 9. Start Hardhat Local Blockchain
Open a new terminal in backend folder:
```bash
npx hardhat node
```
**Keep this terminal running!** You'll see 20 accounts with private keys.

### 10. Deploy Smart Contract
Open another terminal in backend folder:
```bash
npx hardhat run src/blockchain/scripts/deploy.js --network localhost
```

You'll see output like:
```
Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 11. Update .env File
Copy the contract address and first account private key from Hardhat terminal:

```env
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 12. Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Testing the System

### 1. Create Admin User (Postman/Thunder Client)

**POST** `http://localhost:5000/api/auth/register`
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "dob": "1990-01-01"
}
```

**Manually update user role in MongoDB:**
```bash
mongosh
use blockchain-ballotbox
db.users.updateOne({email: "admin@test.com"}, {$set: {role: "admin", isVerified: true}})
```

### 2. Login
**POST** `http://localhost:5000/api/auth/login`
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```
Copy the `token` from response.

### 3. Create Election
**POST** `http://localhost:5000/api/elections`
Headers: `Authorization: Bearer YOUR_TOKEN`
```json
{
  "title": "Student Council Election 2025",
  "description": "Annual student council election",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```
Copy the `_id` from response.

### 4. Add Candidates
**POST** `http://localhost:5000/api/elections/candidates`
Headers: `Authorization: Bearer YOUR_TOKEN`
```json
{
  "name": "John Doe",
  "party": "Progressive Party",
  "manifesto": "Better campus facilities",
  "electionId": "ELECTION_ID_HERE",
  "candidateId": 1
}
```

Repeat for more candidates (candidateId: 2, 3, etc.)

### 5. Register Voter
**POST** `http://localhost:5000/api/auth/register`
```json
{
  "name": "Alice Voter",
  "email": "alice@test.com",
  "password": "voter123",
  "dob": "2000-05-15"
}
```

### 6. Cast Vote
Login as voter, then:

**POST** `http://localhost:5000/api/votes`
Headers: `Authorization: Bearer VOTER_TOKEN`
```json
{
  "electionId": "ELECTION_ID_HERE",
  "candidateId": 1
}
```

**Watch the console!** You'll see:
```
🗳️  Casting vote - Election: 123456, Candidate: 1
📝 Transaction Hash: 0x...
✅ Vote confirmed in Block: 2
⛽ Gas Used: 89234
📡 Event Emitted: VoteCast
```

### 7. Get Results
**GET** `http://localhost:5000/api/votes/results/ELECTION_ID_HERE`
Headers: `Authorization: Bearer YOUR_TOKEN`

## Troubleshooting

**MongoDB not connecting:**
- Ensure MongoDB is running: `mongod`
- Check connection string in .env

**Hardhat errors:**
- Ensure `npx hardhat node` is running
- Restart Hardhat node if needed
- Redeploy contract after restart

**Contract deployment fails:**
- Check hardhat.config.js path settings
- Ensure Voting.sol is in correct location

**Vote fails:**
- Check CONTRACT_ADDRESS and PRIVATE_KEY in .env
- Ensure Hardhat node is running
- Check console logs for specific errors

## Project Complete! ✅

Your blockchain voting system is now running locally. All votes are stored on the blockchain, and you can track every transaction through console logs.

Next step: Build the React frontend to interact with these APIs.