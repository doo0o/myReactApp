import React, { useState, useEffect } from "react";
import styles from './ScrollReset.module.scss'
const ScrollReset = () => {
  const [scrollY, setScrollY] = useState(0);
  const [BtnStatus, setBtnStatus] = useState(false);
  
  const handleFlow = () => {
    setScrollY(window.pageYOffset);
    if (scrollY >= window.innerHeight) {
      // 윈도우 크기를 벗어나면 버튼 활성화
      setBtnStatus(true);
    } else {
      // 윈도우 크기 안에 들어오면 버튼 비활성화
      setBtnStatus(false);
    }
  }

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setScrollY(0);
    setBtnStatus(false);
  }
  useEffect(() => {
    const scrollListener = () => window.addEventListener('scroll', handleFlow)
    scrollListener();
    return () => window.removeEventListener('scroll', handleFlow)
  })

  return (
    <button
      type="button"
      className={`${styles.button} ${BtnStatus && styles.on}`}
      onClick={handleTop}
    >맨 위로가기</button>
  )
}
export default ScrollReset;