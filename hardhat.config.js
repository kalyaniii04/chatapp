require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

if (!process.env.HOLESKY_RPC_URL) {
  throw new Error("HOLESKY_RPC_URL is missing in .env");
}
if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is missing in .env");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    holesky: {
      url: process.env.HOLESKY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 17000,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // first account will be deployer
    },
  },
};
