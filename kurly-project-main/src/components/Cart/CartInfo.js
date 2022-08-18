import React, { useState } from "react";

import styles from "./CartInfo.module.scss";

const CartInfo = () => {
  const [check, setCheck] = useState(false);
  const handleChange = e => {
    // setCheck(true);
  };
  return (
    <form>
      <div className={styles.Container}>
        <div className={styles.Item__wrap}>
          <div className={styles.Check__box}>
            <label className={styles.Check__label}>
              <input type="checkbox" name="checkAll" onChange={handleChange} checked={check}/>
              <i className={styles.Check__ico}></i>전체선택 (0/0)
            </label>
            <div className={styles.Check__del}>
              <a href="#none">선택삭제</a>
            </div>
          </div>

          <div className={`${styles.Item__box} ${styles.__none}`}>
            <p>장바구니에 담긴 상품이 없습니다</p>
          </div>
          
          <div className={styles.Check__box}>
            <label className={styles.Check__label}>
              <input type="checkbox" name="checkAll" onChange={handleChange} checked={check}/>
              <i className={styles.Check__ico}></i>전체선택 (0/0)
            </label>
            <div className={styles.Check__del}>
              <a href="#none">선택삭제</a>
            </div>
          </div>

        </div>
        <div className={styles.Result}>
          <div className={styles.Inner}>

          </div>
        </div>
    </div>
    </form>
  )
}


export default CartInfo;