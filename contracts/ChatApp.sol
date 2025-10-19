// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp {
    struct User {
        string name;
        Friend[] friendList;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string msg;
    }

    mapping(address => User) private userList;
    mapping(bytes32 => Message[]) private allMessages;

    struct AllUserStruct {
        string name;
        address accountAddress;
    }

    AllUserStruct[] private getAllUsers;

    // ✅ Check if user exists
    function checkUserExist(address pubkey) public view returns (bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    // ✅ Create account
    function createAccount(string calldata name) external {
        require(!checkUserExist(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        userList[msg.sender].name = name;
        getAllUsers.push(AllUserStruct(name, msg.sender));
    }

    // ✅ Get username
    function getUsername(address pubkey) external view returns (string memory) {
        require(checkUserExist(pubkey), "User does not exist");
        return userList[pubkey].name;
    }

    // ✅ Add friend
    function addFriend(address friend_key, string memory name) public {
        require(checkUserExist(msg.sender), "Please create your account first");
        require(checkUserExist(friend_key), "Friend user does not exist");
        require(msg.sender != friend_key, "Cannot add yourself as a friend");
        require(
            !checkAlreadyFriends(msg.sender, friend_key),
            "These users are already friends"
        );

        _addFriend(msg.sender, friend_key, name);
        _addFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    // ✅ Check if already friends
    function checkAlreadyFriends(
        address pubkey1,
        address pubkey2
    ) internal view returns (bool) {
        uint256 len1 = userList[pubkey1].friendList.length;
        uint256 len2 = userList[pubkey2].friendList.length;

        // iterate over smaller list for gas efficiency
        if (len1 > len2) {
            (pubkey1, pubkey2) = (pubkey2, pubkey1);
        }

        for (uint256 i = 0; i < userList[pubkey1].friendList.length; i++) {
            if (userList[pubkey1].friendList[i].pubkey == pubkey2) return true;
        }
        return false;
    }

    function _addFriend(
        address me,
        address friend_key,
        string memory name
    ) internal {
        Friend memory newFriend = Friend(friend_key, name);
        userList[me].friendList.push(newFriend);
    }

    // ✅ Get my friend list
    function getMyFriendList() external view returns (Friend[] memory) {
        require(checkUserExist(msg.sender), "Create your account first");
        return userList[msg.sender].friendList;
    }

    // ✅ Compute unique chat code
    function _getChatCode(
        address pubkey1,
        address pubkey2
    ) internal pure returns (bytes32) {
        if (pubkey1 < pubkey2) {
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else {
            return keccak256(abi.encodePacked(pubkey2, pubkey1));
        }
    }

    // ✅ Send message
    function sendMessage(address friend_key, string calldata _msg) external {
        require(checkUserExist(msg.sender), "Sender not registered");
        require(checkUserExist(friend_key), "Receiver not registered");
        require(msg.sender != friend_key, "Cannot send message to yourself");
        require(
            checkAlreadyFriends(msg.sender, friend_key),
            "You are not friends with this user"
        );
        require(bytes(_msg).length > 0, "Message cannot be empty");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        allMessages[chatCode].push(Message(msg.sender, block.timestamp, _msg));
    }

    // ✅ Read messages
    function readMessages(
        address friend_key
    ) external view returns (Message[] memory) {
        require(checkUserExist(msg.sender), "Sender not registered");
        require(checkUserExist(friend_key), "Friend not registered");
        require(
            checkAlreadyFriends(msg.sender, friend_key),
            "You are not friends yet"
        );

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    // ✅ Get all app users
    function getAllAppUser() external view returns (AllUserStruct[] memory) {
        return getAllUsers;
    }
}
