import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CheckIfWalletConnected,
  connectWallet,
  connectWithContract,
} from "../Utils/apiFeature";

// ✅ Create Context
export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
  // -------------------------------
  // 🧩 State Variables
  // -------------------------------
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  // -------------------------------
  // ⚙️ Helper: Ensure User Account Exists
  // -------------------------------
  const ensureUserAccount = async (contract, address) => {
    const exists = await contract.checkUserExist(address);
    if (!exists) {
      setError("Please create your account first before using chat features.");
      throw new Error("Account not created");
    }
    return true;
  };

  // -------------------------------
  // 📦 Fetch Initial Data
  // -------------------------------
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Connect wallet
      const connectAccount = await connectWallet();
      if (!connectAccount) {
        setError("Please connect your wallet first.");
        return;
      }
      setAccount(connectAccount);

      // 2️⃣ Connect contract with signer
      const contract = await connectWithContract(true);
      if (!contract) throw new Error("Contract not connected");

      // 3️⃣ Check if user exists
      console.log("Attempting to check user for address:", connectAccount);
      const isUserExist = await contract.checkUserExist(connectAccount);
      if (!isUserExist) {
        setError("Please create your account first.");
        setFriendLists([]);
        setUserLists([]);
        setUserName("");
        return;
      }

      // 4️⃣ Fetch user-related data
      const [friends, users, name] = await Promise.all([
        contract.getMyFriendList(),
        contract.getAllAppUser(),
        contract.getUsername(connectAccount),
      ]);

      // 5️⃣ Update state
      setFriendLists(friends || []);
      setUserLists(users || []);
      setUserName(name || "");
      setError("");
    } catch (err) {
      console.error("fetchData error:", err);
      setError("Something went wrong while loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🧠 Auto-Fetch on Mount
  // -------------------------------
  useEffect(() => {
    if (window.ethereum) fetchData();
  }, []);

  // -------------------------------
  // 🪪 Create Account
  // -------------------------------
  const createAccount = async ({ name, accountAddress }) => {
    try {
      if (!name || !accountAddress) {
        return setError("Name and account address cannot be empty.");
      }

      const contract = await connectWithContract(true); // signer needed
      const alreadyExists = await contract.checkUserExist(accountAddress);
      if (alreadyExists) {
        return setError("User already exists. Try logging in.");
      }

      setLoading(true);
      const tx = await contract.createAccount(name);
      await tx.wait();

      // Update state locally instead of reload
      setAccount(accountAddress);
      setUserName(name);
      setError("");
    } catch (err) {
      console.error("Create Account Error:", err);
      setError("Error creating your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 👥 Add Friend
  // -------------------------------
  const addFriend = async ({ name, accountAddress }) => {
    try {
      if (!name || !accountAddress) {
        return setError("Provide valid name and account address.");
      }

      const contract = await connectWithContract(true);
      await ensureUserAccount(contract, account);

      const isFriendExist = await contract.checkUserExist(accountAddress);
      if (!isFriendExist) {
        return setError("This user has not created an account yet.");
      }

      setLoading(true);
      const tx = await contract.addFriend(accountAddress, name);
      await tx.wait();

      // Update friend list locally
      const updatedFriends = await contract.getMyFriendList();
      setFriendLists(updatedFriends || []);
      setError("");
      router.push("/");
    } catch (err) {
      console.error("Add Friend Error:", err);
      setError("Failed to add friend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 💬 Send Message
  // -------------------------------
  const sendMessage = async ({ msg, address }) => {
    try {
      if (!msg || !address) {
        return setError("Please type your message before sending.");
      }

      const contract = await connectWithContract(true);
      await ensureUserAccount(contract, account);

      const isFriendExist = await contract.checkUserExist(address);
      if (!isFriendExist) {
        return setError("This friend has not created an account yet.");
      }

      setLoading(true);
      const tx = await contract.sendMessage(address, msg);
      await tx.wait();

      // Optionally fetch messages immediately
      await readMessage(address);
      setError("");
    } catch (err) {
      console.error("Send Message Error:", err);
      setError("Unable to send message. Please check if you’re friends first.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 📥 Read Messages
  // -------------------------------
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectWithContract(true);
      await ensureUserAccount(contract, account);

      const messages = await contract.readMessages(friendAddress);
      setFriendMsg(messages || []);
      setError("");
    } catch (err) {
      console.error("Read Message Error:", err);
      setError("No messages or not connected to a friend.");
    }
  };

  // -------------------------------
  // 👤 Read User Info
  // -------------------------------
  const readUser = async (userAddress) => {
    try {
      const contract = await connectWithContract(true);
      const isUserExist = await contract.checkUserExist(userAddress);
      if (!isUserExist) {
        return setError("Selected user does not exist.");
      }

      const userName = await contract.getUsername(userAddress);
      setCurrentUserName(userName);
      setCurrentUserAddress(userAddress);
      setError("");
    } catch (err) {
      console.error("Read User Error:", err);
      setError("Unable to fetch user data.");
    }
  };

  // -------------------------------
  // 💬 Clear Chat
  // -------------------------------
  const clearChat = () => setFriendMsg([]);

  // -------------------------------
  // 🌐 Context Provider
  // -------------------------------
  return (
    <ChatAppContext.Provider
      value={{
        // Functions
        readMessage,
        createAccount,
        addFriend,
        sendMessage,
        readUser,
        connectWallet,
        CheckIfWalletConnected,
        clearChat,

        // State
        account,
        userName,
        friendLists,
        friendMsg,
        loading,
        userLists,
        error,
        currentUserName,
        currentUserAddress,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
