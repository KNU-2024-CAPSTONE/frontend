import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import clothesimg from '../img/clothes.svg';
import driveimg from '../img/drive.svg';
import plusimg from "../img/plus.png";


function CRM() {

  const openLinkInNewTab = (url) => {
    window.open(url, "_blank", "width=1500,height=800");}

  return (
    <div className="App">
      <div className="bar">
          <nav>
            <ul className="nav">
                <li><span>서비스명</span></li>
                <li><span>마이페이지</span></li>
            </ul>
          </nav>
        </div>
        <div className="title">'도훈'님이 관리중인 쇼핑몰</div>
        <div className="container">
          
          <Link onClick={() => openLinkInNewTab("/S1")} className="no-visited shop shop1">
            <p className="name">쇼핑몰1</p>
            <img className="svg clothes" alt="Clothes" src={clothesimg}  width="60%"/>
          </Link>
          <div className="no-visited shop shop2">
            <p className="name">쇼핑몰2</p>
            <img className="svg drive" alt="Steering Wheel" src={ driveimg }  width="50%"/>
          </div>
          <div className="no-visited shop plus">
            <img className="plus0" alt="Plus" src={ plusimg }  width="50%"/>
          </div>
        </div>
    </div>
  );
}

export default CRM;
