import React from 'react';
import Style from "./Error.module.css";

export default function Error({ error }) {
  return (
    <div className={Style.Error}>
      <div className={Style.Error_box}>
        <h1>Please Fix This Error & Reload Browser</h1>
        <p>{error}</p>
      </div>
    </div>
  );
}
