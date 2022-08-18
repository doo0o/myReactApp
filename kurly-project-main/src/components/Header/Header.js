import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeaderNav from "./HeaderNav";
import HeaderGNB from "./HeaderGNB";
import HeaderSearch from "./HeaderSearch";
import HeaderBadge from "./HeaderBadge";

import './Header.scss'
// import NavMenuCategory from "./NavMenuCategory";
// import NavInput from "./NavInput";

const Header = () => {
  const [ScrollY, setScrollY] = useState(0); // window 의 pageYOffset값을 저장 
  const [ScrollActive, setScrollActive] = useState(false);
  const HeaderHeight = useRef();
  
  const handleScroll = () => {
    if (ScrollY > (HeaderHeight.current.clientHeight - 56)) {
      setScrollY(window.pageYOffset);
      setScrollActive(true);
    } else {
      setScrollY(window.pageYOffset);
      setScrollActive(false);
    }
  }
  useEffect(() => {
    const scrollListener = () => {  window.addEventListener("scroll", handleScroll); } //  window 에서 스크롤을 감시 시작
    scrollListener(); // window 에서 스크롤을 감시
    return () => { window.removeEventListener("scroll", handleScroll); }; //  window 에서 스크롤을 감시를 종료
  })
  return (
    <header id="header" ref={HeaderHeight}>
      <HeaderMessage />
      <HeaderNav />
      <div className="Header__logo">
        <h1 className="logo">
          <span className="blind">마켓컬리</span>
          <Link to="/">
            <img src="https://res.kurly.com/images/marketkurly/logo/logo_x2.png" alt="logo" />
          </Link>
        </h1>
      </div>
      <div className={ScrollActive ? 'Header__gnb __scroll' : 'Header__gnb'} id="gnb">
        <span className="blind">메뉴</span>
        <div className={ScrollActive ? "Header-fixed__wrap -fixed" : "Header-fixed__wrap"}>
          <div className="Header-gnb__Wrapper">
            <HeaderGNB />
            <HeaderSearch />
            <HeaderBadge />
          </div>
        </div>
      </div>
    </header>
  )
}

const HeaderMessage = () => {
  const [click, setClick] = useState(false);
  const Msg = useRef();

  const clickButton = () => {
    Msg.current.classList.add('-close');
    setClick(true);
  }

  return (
    <div className="Header__msg" ref={Msg}>
      <a href="/#none">지금 가입하고 인기상품 <b>100</b>원에 받아가세요!
        <img src="https://res.kurly.com/pc/ico/1908/ico_arrow_fff_84x84.png" alt="" className="ico__arr" />
        <button type="button" className="ico__close" onClick={clickButton}></button>
      </a>
    </div>
  )
}

export default Header;