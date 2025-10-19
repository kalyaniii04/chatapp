import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Style from './Chat.module.css';
import images from '../../../assets';
import { convertTime } from '../../../Utils/apiFeature';
import { Loader } from '../../index';

export default function Chat({
  functionName,
  friendMsg = [],
  account,
  userName,
  loading,
  currentUserName,
  currentUserAddress
}) {
  const [message, setMessage] = useState('');

  return (
    <div className={Style.Chat}>
      {/* Current user info */}
      {currentUserName && currentUserAddress && (
        <div className={Style.Chat_user_info}>
          <Image src={images.accountName} alt="user" width={70} height={70} />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      )}

      {/* Chat box */}
      <div className={Style.Chat_box_box}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {friendMsg.map((el, i) => {
              const isCurrentUser = el.sender?.toLowerCase() === account?.toLowerCase();
              const senderName = isCurrentUser ? userName || "You" : currentUserName || "Friend";

              return (
                <div key={i}>
                  <div className={isCurrentUser ? Style.Chat_box_right_title : Style.Chat_box_left_title}>
                    <Image
                      src={images.accountName}
                      alt={isCurrentUser ? "you" : "friend"}
                      width={50}
                      height={50}
                    />
                    <span>
                      {senderName} <small>Time: {convertTime(el.timestamp)}</small>
                    </span>
                  </div>
                  <p>{el.msg}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input area */}
        {currentUserAddress && currentUserName && (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <Image src={images.smile} alt="smile" width={40} height={40} />
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Image src={images.file} alt="file" width={40} height={40} />
              {loading ? (
                <Loader />
              ) : (
                <Image
                  src={images.send}
                  alt="send"
                  width={40}
                  height={40}
                  onClick={() => {
                    if (message.trim() === '') return;
                    functionName({ msg: message, address: currentUserAddress });
                    setMessage('');
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
