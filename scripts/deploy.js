// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // 1️⃣ Get the ContractFactory
  const ChatApp = await hre.ethers.getContractFactory("ChatApp");

  // 2️⃣ Deploy the contract
  const chatApp = await ChatApp.deploy();

  // 3️⃣ Wait for deployment (v6 syntax)
  if (chatApp.waitForDeployment) {
    await chatApp.waitForDeployment();
  } else {
    // v5 syntax: wait for transaction to be mined
    await chatApp.deployed();
  }

  // 4️⃣ Get deployed address (v6 or v5)
  const deployedAddress = chatApp.getAddress
    ? await chatApp.getAddress() // v6
    : chatApp.address;           // v5

  console.log("ChatApp deployed to:", deployedAddress);
}

// 5️⃣ Error handling
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
