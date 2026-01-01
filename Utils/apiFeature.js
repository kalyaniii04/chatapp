import { BrowserProvider, Contract } from "ethers";
import Web3Modal from "web3modal";
import chatAppJSON from "../Context/ChatApp.json";

export const ChatAppABI = chatAppJSON.abi;

let web3Modal;
let cachedConnection;

const getWeb3Modal = () => {
  if (!web3Modal) {
    web3Modal = new Web3Modal({
      cacheProvider: true,
    });
  }
  return web3Modal;
};

// ✅ Connect wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
};

// ✅ Get contract safely
const fetchContract = async (provider, signer = null) => {
  let network;

  try {
    network = await provider.getNetwork();
  } catch {
    return null;
  }

  let address;

  if (network.chainId === 17000n) {
    address = "0x15696678D8ca6668aF096C871C8d0FC4c816037a"; // Holesky
  } else if (network.chainId === 31337n) {
    const deployment = require("../deployments/localhost/ChatApp.json");
    address = deployment.address;
  } else {
    throw new Error("Unsupported network");
  }

  return new Contract(address, ChatAppABI, signer || provider);
};

// ✅ Connect with contract (NO network error)
export const connectWithContract = async (needSigner = true) => {
  const modal = getWeb3Modal();
  const connection = cachedConnection || (await modal.connect());
  cachedConnection = connection;

  // ✅ "any" mode prevents NETWORK_ERROR
  const provider = new BrowserProvider(connection, "any");

  // ✅ Switch FIRST
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0x4268" }, // Holesky
    ]);
  } catch (_) {}

  const signer = needSigner ? await provider.getSigner() : null;
  return fetchContract(provider, signer);
};

// ✅ Time helper
export const convertTime = (time) => {
  const d = new Date(Number(time) * 1000);
  return `${d.toLocaleTimeString()} | ${d.toLocaleDateString()}`;
};

// ✅ Clear cache
export const resetWeb3Cache = async () => {
  const modal = getWeb3Modal();
  await modal.clearCachedProvider();
  cachedConnection = null;
};
