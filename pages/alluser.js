import React, { useState, useEffect, useContext } from 'react'

import { UserCard } from '../Components/index';
import Style from "../styles/alluser.module.css";
import { ChatAppContext } from '../Context/ChatAppContext';

export default function alluser() {
    
    const { userLists, addFriend } = useContext(ChatAppContext);
    return (
        <div>
            <div className={Style.alluser_info}>
                <h1>Find your Friends</h1>
            </div>

            <div className={Style.alluser}>
                {userLists.map((el, i) => (
                    <UserCard key={i + 1} i={i} el={el} addFriend={addFriend} />
                ))}
            </div>
        </div>
    )
}
