import React from 'react'

import Style from './Card.module.css'
import images from '../../../assets';
import Link from 'next/link';
import Image from 'next/image';

export default function Card({ i, el, readMessage, readUser }) {
  return (
    <Link
      className={Style.Card_link}
      href={
        {
          pathname: '/',
          query: { name: `${el.name}`, address: `${el.pubkey}` }
        }
      }>
      <div
        className={Style.Card}
        onClick={() => (readMessage(el.pubkey), readUser(el.pubkey))}
      >
        <div className={Style.Card_box}>
          <div className={Style.Card_box_left}>
            <Image
              src={images.accountName}
              alt="username"
              width={50}
              height={50}
              className={Style.Card_box_left_img}
            />
          </div>
          <div className={Style.Card_box_right}>
            <h4 className={Style.Card_box_right_name}>{el.name}</h4>
            <small className={Style.Card_box_right_address}>
              {el.pubkey.slice(0, 20)}...
            </small>
          </div>
          <div className={Style.Card_box_right_end}>
            <small>{ i + 1 }</small>
          </div>
        </div>
      </div>
      </Link>
  )
}
