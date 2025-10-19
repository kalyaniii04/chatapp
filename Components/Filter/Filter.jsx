import React, { useState, useContext } from "react";
import Image from "next/image";

import Style from "./Filter.module.css";
import images from "../../assets";
import { ChatAppContext } from "../../Context/ChatAppContext";
import { Model } from "../index";

export default function Filter() {
  const { account, addFriend, clearChat } = useContext(ChatAppContext); // ✅ added clearChat
  const [addFriends, setAddFriend] = useState(false);

  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
          <div className={Style.Filter_box_left_search}>
            <Image
              src={images.search}
              alt="search"
              width={20}
              height={20}
              className={Style.Filter_box_left_search_img}
            />
            <input
              type="text"
              placeholder="Search..."
              className={Style.Filter_box_left_search_input}
            />
          </div>
        </div>

        <div className={Style.Filter_box_right}>
          {/* ✅ Clear Chat Button */}
          <button onClick={clearChat}>
            <Image src={images.clear} alt="clear" width={20} height={20} />
            CLEAR CHAT
          </button>

          {/* Add Friend */}
          <button onClick={() => setAddFriend(true)}>
            <Image src={images.user} alt="user" width={20} height={20} />
            ADD FRIEND
          </button>
        </div>
      </div>

      {/* Model component */}
      {addFriends && (
        <div className={Style.Filter_model}>
          <Model
            openBox={setAddFriend}
            title="WELCOME TO"
            head="CHAT BUDDY"
            info={`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Ipsam animi porro earum delectus, 
              optio iure, blanditiis ipsa dolores illo, 
              necessitatibus esse quo ullam. 
              Quaerat fugiat eius quam saepe, pariatur voluptate.`}
            smallInfo="Kindly select your Friend's Name and Address"
            image={images.hero}
            functionName={addFriend}
          />
        </div>
      )}
    </div>
  );
}
