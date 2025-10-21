import { BrowserProvider, Contract } from "ethers";
import Web3Modal from "web3modal";
import chatAppJSON from "../Context/ChatApp.json"; // ABI

export const ChatAppABI = chatAppJSON.abi;

// ✅ Cache for provider to prevent repeated popups
let web3Modal;
let cachedConnection;

// ✅ Initialize Web3Modal once
const getWeb3Modal = () => {
  if (!web3Modal) {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      disableInjectedProvider: false,
    });
  }
  return web3Modal;
};

// ✅ Connect wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask extension.");
      return null;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.error("❌ Error connecting wallet:", error);
    return null;
  }
};

// ✅ Helper: Get contract for a specific network
const fetchContract = async (provider, signer = null) => {
  const network = await provider.getNetwork();
  console.log("🌐 Connected network:", network);

  let ChatAppAddress;

  if (network.chainId === 17000n) { // Holesky
    ChatAppAddress = "0x15696678D8ca6668aF096C871C8d0FC4c816037a"; // replace with actual <-----<-----<-----
  } else if (network.chainId === 31337n) { // Localhost
    const deployment = require("../deployments/localhost/ChatApp.json");
    ChatAppAddress = deployment.address;
  } else {
    throw new Error("Unsupported network. Please switch to Holesky or localhost.");
  }

  return new Contract(ChatAppAddress, ChatAppABI, signer || provider);
};


// ✅ Connect with contract (provider + signer)
export const connectWithContract = async (needSigner = true) => {
  try {
    const web3Modal = getWeb3Modal();
    const connection = cachedConnection || (await web3Modal.connect());
    if (!cachedConnection) cachedConnection = connection;

    const provider = new BrowserProvider(connection);

    // ✅ Ensure we are on Holesky
    const network = await provider.getNetwork();
    if (network.chainId !== 17000 && network.chainId !== 31337) {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: "0x4268" }, // 17000 in hex
        ]);
      } catch (switchError) {
        console.error("Switch to Holesky failed:", switchError);
      }
    }

    const signer = needSigner ? await provider.getSigner() : null;
    return await fetchContract(provider, signer);
  } catch (error) {
    console.error("❌ Error connecting with contract:", error);
    return null;
  }
};

// ✅ Convert timestamp to readable format
export const convertTime = (time) => {
  try {
    const newTime = new Date(Number(time) * 1000);
    return `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}  |  ${newTime.getDate()}/${newTime.getMonth() + 1}/${newTime.getFullYear()}`;
  } catch (error) {
    console.error("❌ Time conversion error:", error);
    return "Invalid Time";
  }
};

// ✅ Clear Web3Modal cache
export const resetWeb3Cache = async () => {
  try {
    const web3Modal = getWeb3Modal();
    await web3Modal.clearCachedProvider();
    cachedConnection = null;
  } catch (error) {
    console.error("❌ Error clearing Web3Modal cache:", error);
  }
};
