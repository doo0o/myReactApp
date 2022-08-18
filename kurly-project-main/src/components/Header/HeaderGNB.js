import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { KURLY_API } from "../../config";

const HeaderGNB = () => {
  const [isDropDown, setIsDropDown] = useState(false);
  const [isDropDownNext, setIsDropDownNext] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [currentNo, setCurrentNo] = useState(772);
  const [isActive, setIsActive] = useState([]);

  useEffect(()=>{
    fetch(KURLY_API)
    .then(res => res.json())
      .then(data => {
      setItemList(data.data.categories);
      setIsActive(Array(data.data.categories.length).fill(false));
    })
    .catch(err => console.log(err))
    return ()=>{
      
    }
  }, []) //빈배열을 선언하세요!

  const onMouseEnterMenu = () => setIsDropDown(true);
  const onMouseLeaveMenu = () => setIsDropDown(false);

  const handleClass = idx => {
    setIsActive(isActive.map((element, index) => {
      return index === idx;
    }));
  }
  const findSubCategories = no => { 
    const subCategory = itemList.find(
      category => +category.no === +no
    );
    if (!subCategory) return [];
    return subCategory.categories;
  }
  const CATEGORY = ["신상품", "베스트", "알뜰쇼핑", "특가/혜택"];

  return (
    <ul>
      <li
        onMouseEnter={onMouseEnterMenu}
        onMouseLeave={onMouseLeaveMenu}
      >
      <Link to="#none">
        <i className="Header-gnb__ico"></i>
        <span>전체 카테고리</span>
      </Link>
      
      <div
        className="Gnb-sub__menu"
        style={{
          display: isDropDown ? "block" : "none",
        }}
      >
        <div
          className="Gnb-sub__List"
          onMouseLeave={() => {
            setCurrentNo(0);
            setIsDropDown(true);
            setIsDropDownNext(false);
          }
        }
        >
          <ul>
            {itemList.map((item, index) => {
              return (
                <li
                  key={item.no}
                  onMouseEnter={() => {
                      setCurrentNo(item.no);
                      setIsDropDownNext(true);
                      handleClass(index);
                    }
                  }
                  className={isActive[index] ? 'current': ''}
                >
                  <Link to="#none">
                    <span className="Gnb-sub__ico">
                      <img src={item.pc_icon_url} alt="아이콘" className="on"/>                    
                      <img src={item.pc_icon_active_url} alt="아이콘" className="off"/>    
                    </span>
                    <span className="Gnb-sub__name">{item.name}</span>
                  </Link>

                  <ul
                    className="Lbn__menu"
                    style={{ display: isDropDownNext ? 'block' : 'none' }}
                    onMouseEnter={() => {
                      setCurrentNo(currentNo);
                      setIsDropDownNext(true);
                    }
                    }
                  >
                    {findSubCategories(currentNo).map(subList => {
                      return (
                        <li
                          key={subList.no}
                          className={isDropDownNext && 'on'}
                        >
                          <Link to="#none">
                            <span>{subList.name}</span>
                          </Link>
                      </li>
                      )
                    })}
                  </ul>
                </li>
              )
              })}
          </ul>
        </div>
      </div>
      </li>
    {CATEGORY.map((category, index) => {
      return (
        <li key={index}>
          <Link to="#">
            <span>{category}</span>
          </Link>
        </li>
      )
    })}
    </ul>
  )
}


export default HeaderGNB;