import { BrowserProvider, Contract } from "ethers";
import Web3Modal from "web3modal";
import chatAppJSON from "../Context/ChatApp.json";

export const ChatAppABI = chatAppJSON.abi;

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const HOLESKY_CHAIN_ID = 17000n;
const LOCAL_CHAIN_ID = 31337n;

const HOLESKY_ADDRESS = "0x15696678D8ca6668aF096C871C8d0FC4c816037a";

let web3Modal;
let cachedConnection = null;

// ─────────────────────────────────────────────
// Web3Modal singleton
// ─────────────────────────────────────────────

const getWeb3Modal = () => {
  if (!web3Modal) {
    web3Modal = new Web3Modal({
      cacheProvider: true,
    });
  }
  return web3Modal;
};

// ─────────────────────────────────────────────
// Wallet connection
// ─────────────────────────────────────────────

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
};

// ─────────────────────────────────────────────
// Resolve contract address
// ─────────────────────────────────────────────

const resolveContractAddress = async (provider) => {
  const network = await provider.getNetwork();

  if (network.chainId === HOLESKY_CHAIN_ID) {
    return HOLESKY_ADDRESS;
  }

  if (network.chainId === LOCAL_CHAIN_ID) {
    const deployment = require("../deployments/localhost/ChatApp.json");
    return deployment.address;
  }

  throw new Error("Unsupported network");
};

// ─────────────────────────────────────────────
// Contract factory
// ─────────────────────────────────────────────

const getContract = async (provider, signer = null) => {
  const address = await resolveContractAddress(provider);

  const code = await provider.getCode(address);
  if (code === "0x") {
    throw new Error("Contract not deployed on this network");
  }

  return new Contract(address, ChatAppABI, signer || provider);
};

// ─────────────────────────────────────────────
// Main connector (READ / WRITE)
// ─────────────────────────────────────────────

export const connectWithContract = async (needSigner = true) => {
  const modal = getWeb3Modal();
  const connection = cachedConnection || (await modal.connect());
  cachedConnection = connection;

  const provider = new BrowserProvider(connection);
  const network = await provider.getNetwork();

  // ✅ DO NOT FORCE NETWORK
  if (
    network.chainId !== LOCAL_CHAIN_ID &&
    network.chainId !== HOLESKY_CHAIN_ID
  ) {
    throw new Error(
      "Please switch MetaMask to Localhost (31337) or Holesky (17000)"
    );
  }

  const signer = needSigner ? await provider.getSigner() : null;
  return getContract(provider, signer);
};

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

export const convertTime = (time) => {
  const date = new Date(Number(time) * 1000);
  return `${date.toLocaleTimeString()} | ${date.toLocaleDateString()}`;
};

export const resetWeb3Cache = async () => {
  const modal = getWeb3Modal();
  await modal.clearCachedProvider();
  cachedConnection = null;
};
