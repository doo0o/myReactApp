import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './HeaderSearch.module.scss'

function HeaderSearch() {
  const [focus, setFocus] = useState(false);
  const [valueCheck, setValueCheck] = useState(false);
  const [search, setSearch] = useState('');

  const searchInput = useRef();
  const history = useNavigate();

  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);
  const onInput = e => {
    if (e.target.value === '') {
      setValueCheck(false);
    } else {
      setValueCheck(true); 
      setSearch(e.target.value);
    }
  }
  const onReset = () => {
    setValueCheck(false);
    searchInput.current.value = '';
  }
  return (
    <div className={styles.Wrapper}>
      <form>
        <input
          type="text"
          className={`${styles.Input} ${focus ? styles.focus : ''}`}
          placeholder="검색어를 입력해주세요." 
          onFocus={onFocus}
          onBlur={onBlur}
          onInput={onInput}
          ref={searchInput}
          onSubmit={
            () => {
              history(`/search/${search}`);
              setSearch("");
            }
          }
          required
          />
        <button type="button" className={`${styles.Btn} ${styles.DelBtn} ${valueCheck ? styles.on : ''}`} onClick={onReset}>삭제 버튼</button>
        <button type="submit" className={`${styles.Btn} ${styles.SubmitBtn}`}>검색 버튼</button>
      </form>
    </div>
  )
}

export default HeaderSearch;