//0x5FbDB2315678afecb367f032d93F642f64180aa3
import chatAppJSON from "./ChatApp.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

// export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ChatAppAddress = CONTRACT_ADDRESS;

export const ChatAppABI = chatAppJSON.abi;