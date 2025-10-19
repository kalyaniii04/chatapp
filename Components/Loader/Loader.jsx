import React from 'react'
import Image from 'next/image';

import Style from "./Loader.module.css";
import images from "../../assets"

export default function Loader() {
  return (
    <div className={Style.Loader}>
      <div className={Style.Loader_box}>
        <Image src={images.loader} alt='Loader' height={100} width={100}/> 
      </div>
    </div>
  )
}
