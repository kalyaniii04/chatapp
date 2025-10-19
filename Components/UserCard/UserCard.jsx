import React from 'react';
import Image from 'next/image';

import Style from "./UserCard.module.css";
import images from "../../assets";

export default function UserCard({ i, el, addFriend }) {
  // console.log("UserCard props:", { i, el });
  return (
    <div className={Style.UserCard}>
      <div className={Style.UserCard_box}>
        <Image
          className={Style.UserCard_img}
          src={images[`image${i + 1}`]}
          alt='user'
          height={100}
          width={100}
        />

        <div className={Style.UserCard_box_info}>
          <h2>{el.name}</h2>
          <p>{el.accountAddress.slice(0, 25)}...</p>
          <button onClick={() => addFriend({ name: el.name, accountAddress: el.accountAddress })}>Add Friend</button>

          <small className={Style.number}>{ i + 1 }</small>
        </div>
      </div>
    </div>
  )
}
