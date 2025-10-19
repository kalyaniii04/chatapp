import { BrowserProvider, Contract } from "ethers";
import Web3Modal from "web3modal";
import { ChatAppAddress, ChatAppABI } from "../Context/constants";

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

// ✅ Check if wallet is connected
export const CheckIfWalletConnected = async () => {
  try {
    if (!window.ethereum) {
      console.log("🦊 Install MetaMask extension to continue.");
      return null;
    }
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts.length ? accounts[0] : null;
  } catch (error) {
    console.error("❌ Error checking wallet connection:", error);
    return null;
  }
};

// ✅ Manually connect wallet
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

// ✅ Helper: Create contract instance
const fetchContract = (signerOrProvider) => {
  return new Contract(ChatAppAddress, ChatAppABI, signerOrProvider);
};

// ✅ Connect with contract (either with provider or signer)
export const connectWithContract = async (needSigner = true) => {
  try {
    const web3Modal = getWeb3Modal();

    // 🔄 Use cached connection if available (avoids re-popup)
    const connection = cachedConnection || (await web3Modal.connect());
    if (!cachedConnection) cachedConnection = connection;

    // Ethers v6: Use BrowserProvider instead of Web3Provider
    const provider = new BrowserProvider(connection);

    if (needSigner) {
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);
      return contract;
    } else {
      const contract = fetchContract(provider);
      return contract;
    }
  } catch (error) {
    console.error("❌ Error connecting with contract:", error);
    return null;
  }
};

// ✅ Convert timestamp to readable format
export const convertTime = (time) => {
  try {
    const newTime = new Date(Number(time) * 1000);
    const formatted = `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}  |  ${newTime.getDate()}/${
      newTime.getMonth() + 1
    }/${newTime.getFullYear()}`;
    return formatted;
  } catch (error) {
    console.error("❌ Time conversion error:", error);
    return "Invalid Time";
  }
};

// ✅ Clear cache if user disconnects wallet manually
export const resetWeb3Cache = async () => {
  try {
    const web3Modal = getWeb3Modal();
    await web3Modal.clearCachedProvider();
    cachedConnection = null;
  } catch (error) {
    console.error("❌ Error clearing Web3Modal cache:", error);
  }
};
