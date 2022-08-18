import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from './HeaderNav.module.scss'

const HeaderNav = () => {
  const [loginText, setLoginText] = useState('로그아웃');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.removeItem('token');
    setLoginText('로그인');
    navigate('/');
  }
  return (
    <div className={styles.Wrapper}>
      <div className={styles.delivery}>
        <Link to='/'>
          <img alt="delivery" src="https://res.kurly.com/pc/service/common/2011/delivery_220630.png" />
        </Link>
      </div>
      <ul className={styles.menu}>
          <li>
            <Link to="/signup" className={styles.signUpColor}>
              회원가입
            </Link>
          </li>
          <li>
            {localStorage.getItem("token") ? (
              <span onClick={handleLogin}>{loginText}</span>
            ) : (
              <span onClick={() => navigate("/login")}>
                로그인
              </span>
            )}
          </li>
          <li>
            <Link to='#none'>고객센터</Link>
            <ul className={styles.cc__menu}>
              <li>
                <Link to='#none'>공지사항</Link>
              </li>
              <li>
                <Link to='#none'>자주하는 질문</Link>
              </li>
              <li>
                <Link to='#none'>1:1 문의</Link>
              </li>
              <li>
                <Link to='#none'>대량주문 문의</Link>
              </li>
              <li>
                <Link to='#none'>상품 제안</Link>
              </li>
              <li>
                <Link to='#none'>에코포장 피드백</Link>
              </li>
            </ul>
          </li>
        </ul>
    </div>
  )
}

export default HeaderNav;