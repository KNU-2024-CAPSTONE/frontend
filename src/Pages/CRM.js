import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import clothesimg from '../img/clothes.svg';
import driveimg from '../img/drive.svg';
import plusimg from "../img/plus.png";


function CRM() {

  const [shoplog, setShoplog] = useState([]);
  const baseURL = 'http://localhost:8080'
  
  useEffect(() => {
    fetch(`${baseURL}/api/shop`)
    .then((response) => response.json())
    .then((data) => setShoplog(data));
  }, []);

  const openLinkInNewTab = (url, shopid) => {
    const newUrl = `${url}?shopid=${shopid}`;
    window.open(newUrl, "_blank", "width=1500,height=800");
  };

  return (
    <div className="App">
      <div className="bar">
          <nav>
            <ul className="nav">
                <li><span>CRM</span></li>
                <li><span>마이페이지</span></li>
            </ul>
          </nav>
        </div>
        <div className="title">'도훈'님이 관리중인 쇼핑몰</div>
        <div className="container">
          
          <Link onClick={() => openLinkInNewTab("/S1", 1)} className="no-visited shop shop1">
          <p className="name">{shoplog?.[0]?.name || "로딩 중..."}</p>
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
