import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './HeaderBadge.module.scss'

function HeaderBadge() {
  const history = useNavigate();
  return (
    <div className={styles.Wrapper}>
      <div className={`${styles.Badge} ${styles.location}`}>
        <button type="button">배송지 등록</button>
        <div className={styles.modal}>
          <div className={styles.no__address}>
            <p><em>배송지를 등록</em>하고<br />구매 가능한 상품을 확인하세요!</p>
            <div className={styles.btns__group}>
              <button type="button" className={styles.login}>로그인</button>
              <button type="button" className={styles.search__address}>
                <i className={styles.ico}></i>주소검색
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.Badge} ${styles.pick}`}>
        <button type="button">상품 찜</button>
      </div>
      <div className={`${styles.Badge} ${styles.cart}`}>
        <button type="button" onClick={() => history('/cart')}>장바구니</button>
      </div>
    </div>
  )
}

export default HeaderBadge;