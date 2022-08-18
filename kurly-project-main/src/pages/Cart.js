import React from "react";

import CartInfo from "../components/Cart/CartInfo"
import styles from "./Cart.module.scss"

const Cart = () => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Title}>
        <h2>장바구니</h2>
      </div>
      <CartInfo />
    </div>
  )
}
export default Cart;