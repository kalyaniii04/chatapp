import React, { useState, useContext } from 'react';
import images from '../../assets';
import Style from './Friend.module.css';
import Card from './Card/Card';
import Chat from './Chat/Chat';

import { ChatAppContext } from '../../Context/ChatAppContext';

export default function Friend() {
  const {
    account,
    friendLists,
    sendMessage,
    readMessage,
    userName,
    loading,
    currentUserName,
    currentUserAddress,
    readUser,
    friendMsg
  } = useContext(ChatAppContext);
  
  console.log("friendlist-->", {friendLists});

  return (
    <div className={Style.Friend}>
      <div className={Style.Friend_box}>
        <div className={Style.Friend_box_left}>
          {
            friendLists.map((el, i) => (
              <Card
                key={i + 1}
                i={i}
                el={el}
                readMessage={readMessage}
                readUser={readUser}
              />
            )
            )
          }
        </div>
        <div className={Style.Friend_box_right}>
          <Chat
            functionName={sendMessage}
            friendMsg={friendMsg}
            readMessage={readMessage}
            account={account}
            userName={userName}
            loading={loading}
            currentUserName={currentUserName}
            currentUserAddress={currentUserAddress}
          />
        </div>
      </div>
    </div>
  )
}
