import React, {useState, useEffect, useRef} from "react";
import styles from "./Sticky.module.scss"
export default function Sticky() {
  const [ScrollY, setScrollY] = useState(0); // window 의 pageYOffset값을 저장 
  const [ScrollActive, setScrollActive] = useState(false);
  const [currentY, setCurrentY] = useState(0);
  const sticky = useRef();

  const handleScroll = () => {
    if (ScrollY > 415) {
      setCurrentY(ScrollY + window.innerHeight / 2 - sticky.current.clientHeight - 56);
      setScrollY(window.pageYOffset);
      setScrollActive(true);
    } else {
      setCurrentY(0);
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
    <div className={styles.wrap} id="sticky" style={{ top: ScrollActive ? currentY + 'px': ''}} ref={sticky}>
      <div className={styles.box}>
        <div className={styles.info}>
          <a href="#none">
            <img src="https://res.kurly.com/pc/service/main/1904/bnr_quick_20190403.png" alt="퀄리티있게 샛별배송" />
          </a>
        </div>
        <div className={styles.menu}>
          <a href="#none">등급별 혜택</a>
          <a href="#none">레시피</a>
          <a href="#none">베스트 후기</a>
        </div>
      </div>
    </div>
  )
}
