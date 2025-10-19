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

      const contract = await connectWithContract();
      const connectAccount = await connectWallet();

      if (!connectAccount) {
        setError("Please connect your wallet first.");
        return;
      }

      setAccount(connectAccount);

      // ✅ Step 1: Check if user exists
      const isUserExist = await contract.checkUserExist(connectAccount);

      if (!isUserExist) {
        setError("Create your account first.");
        setFriendLists([]);
        setUserLists([]);
        setUserName("");
        return;
      }

      // ✅ Step 2: Fetch user-related data (only if user exists)
      const [friends, users, name] = await Promise.all([
        contract.getMyFriendList(),
        contract.getAllAppUser(),
        contract.getUsername(connectAccount),
      ]);

      // ✅ Step 3: Update state safely
      setFriendLists(friends || []);
      setUserLists(users || []);
      setUserName(name || "");
      setError("");
    } catch (err) {
      console.error("Error in fetchData:", err);
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

      const contract = await connectWithContract();
      const alreadyExists = await contract.checkUserExist(accountAddress);

      if (alreadyExists) {
        return setError("User already exists. Try logging in instead.");
      }

      const tx = await contract.createAccount(name);
      setLoading(true);
      await tx.wait();
      window.location.reload();
    } catch (err) {
      console.error("Create Account Error:", err);
      setError("Error while creating your account, please reload the browser.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 👥 Add Friend
  // -------------------------------
  const addFriend = async ({ name, accountAddress }) => {
    try {
      // if (!name || !accountAddress) {
      //   return setError("Please provide valid name and account address.");
      // }

      const contract = await connectWithContract();
      await ensureUserAccount(contract, account);

      const isFriendExist = await contract.checkUserExist(accountAddress);
      if (!isFriendExist) {
        return setError("This user has not created an account yet.");
      }

      const tx = await contract.addFriend(accountAddress, name);
      setLoading(true);
      await tx.wait();

      router.push("/");
      window.location.reload();
    } catch (err) {
      console.error("Add Friend Error:", err);
      setError("Something went wrong while adding friends. Try again.");
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

      const contract = await connectWithContract();
      await ensureUserAccount(contract, account);

      const isFriendExist = await contract.checkUserExist(address);
      if (!isFriendExist) {
        return setError("This friend has not created an account yet.");
      }

      const tx = await contract.sendMessage(address, msg);
      setLoading(true);
      await tx.wait();

      window.location.reload();
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
      const contract = await connectWithContract();
      await ensureUserAccount(contract, account);

      const messages = await contract.readMessages(friendAddress);
      setFriendMsg(messages);
    } catch (err) {
      console.error("Read Message Error:", err);
      setError("Currently you have no messages or not connected to a friend.");
    }
  };

  // -------------------------------
  // 👤 Read User Info
  // -------------------------------
  const readUser = async (userAddress) => {
    try {
      const contract = await connectWithContract();
      const isUserExist = await contract.checkUserExist(userAddress);

      if (!isUserExist) {
        return setError("Selected user does not exist.");
      }

      const userName = await contract.getUsername(userAddress);
      setCurrentUserName(userName);
      setCurrentUserAddress(userAddress);
    } catch (err) {
      console.error("Read User Error:", err);
      setError("Unable to fetch user data. Please try again.");
    }
  };

  // 💬 Clear Chat
const clearChat = () => {
  setFriendMsg([]); // clear messages locally
};


  // 🌐 Context Provider
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
