import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Style from "./NavBar.module.css";
import { ChatAppContext } from "../../Context/ChatAppContext";
import { Model, Error } from "../index"; // Make sure Error is imported properly
import images from "../../assets";

export default function NavBar() {
  const menuItems = [
  { menu: "All Users", link: "alluser" },
  { menu: "Chats", link: "/" },
  { menu: "Contact", link: "/" },
  { menu: "Setting", link: "/" },
  { menu: "FAQs", link: "/" },
  { menu: "Terms of Use", link: "/" },
];


  const [active, setActive] = useState(2);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const { account, userName, connectWallet, createAccount, error } = useContext(ChatAppContext);

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        {/* LEFT - LOGO */}
        <div className={Style.NavBar_box_left}>
          <Image src={images.logo} alt="logo" height={50} width={50} />
        </div>

        {/* RIGHT SECTION */}
        <div className={Style.NavBar_box_right}>
          {/* Desktop Menu */}
          <div className={Style.NavBar_box_right_menu}>
            {menuItems.map((el, i) => (
              <div
                key={i + 1}
                onClick={() => setActive(i + 1)}
                className={`${Style.NavBar_box_right_menu_items} 
                ${active === i + 1 ? Style.active_btn : ""}`}
              >
                <Link
                  className={Style.NavBar_box_right_menu_items_link}
                  href={el.link}
                >
                  {el.menu}
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile Menu */}
          {open && (
            <div className={Style.Mobile_menu}>
              {menuItems.map((el, i) => (
                <div
                  key={i + 1}
                  onClick={() => {
                    setActive(i + 1);
                    setOpen(false);
                  }}
                  className={`${Style.Mobile_menu_items} 
                  ${active === i + 1 ? Style.active_btn : ""}`}
                >
                  <Link
                    className={Style.Mobile_menu_items_link}
                    href={el.link}
                  >
                    {el.menu}
                  </Link>
                </div>
              ))}

              {/* Close button */}
              <p className={Style.Mobile_menu_btn}>
                <Image
                  src={images.close}
                  alt="close"
                  height={40}
                  width={40}
                  onClick={() => setOpen(false)}
                />
              </p>
            </div>
          )}

          {/* Connect Wallet */}
          <div className={Style.NavBar_box_right_connect}>
            {account === "" ? (
              <button onClick={connectWallet}>
                <span>Connect Wallet</span>
              </button>
            ) : (
              <button onClick={() => setOpenModel(true)}>
                <Image
                  src={userName ? images.accountName : images.create2}
                  alt="Account"
                  width={20}
                  height={20}
                />
                <small>{userName || "Create Account"}</small>
              </button> 
            )} 
          </div>

          {/* Mobile open button */}
          <div
            className={Style.NavBar_box_right_open}
            onClick={() => setOpen(true)}
          >
            <Image src={images.open} alt="open" width={30} height={30} />
          </div>
        </div>
      </div>

      {/* Modal Component — opens when openModel = true */}
      {openModel && (
        <div className={Style.modelBox}>
          <Model
            openBox={setOpenModel}
            title="WELCOME TO"
            head="CHAT BUDDY"
            info="Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Ipsam animi porro earum delectus, 
            optio iure, blanditiis ipsa dolores illo, 
            necessitatibus esse quo ullam. 
            Quaerat fugiat eius quam saepe, pariatur voluptate."
            smallInfo="Kindly select your name"
            image={images.hero}
            functionName={createAccount}
            address={account}
          />
        </div>
      )}

      {/* Error Message (safely handles Error object) */}
      {error == "" ? "" : <Error error={error} />}
    </div>
  );
}
