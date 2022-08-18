import React, { useState, useEffect} from "react";
import axios from 'axios';
import useAsync from '../../useAsync';

import { API } from '../../config';

import Slider from "react-slick";
// Import Swiper styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './Card.scss'

export function CardList({ title, products, link, subtitle, view }) {
  const [card, setCards] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setCards(null);
        // loading 상태를 true 로 바꿉니다.
        const response = await axios.get(API + 'products');
        setCards(response.data[products]);
      } catch (error) {
        console.log(error)
      }
    }
    fetchCard();
  }, [products]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: view,
    slidesToScroll: view,
    lazyLoad: 'ondemand',
  };

  return (
    <section>
      <div className="Main__card">
        <div className="Card__wrap">
          <div className="Card__title">
            <h2>
            {link === true ?
              <a href="#none">
                <span>
                  <span>{title}</span>
                  <span className="ico__arr">
                    <img src="https://s3.ap-northeast-2.amazonaws.com/res.kurly.com/kurly/ico/2021/arrow_title_32_32.svg" alt="더보기 아이콘" />
                  </span>
                </span>
              </a>:
              <span>{title}</span>
            }
            {subtitle && <p>{subtitle}</p>}
            </h2>
          </div>
          <Slider className="Card__swiper" {...settings}>
            {card && card.map(item => {
              return (
                <div key={item.no}>
                  <div className="Card__slide">
                    <div className="Thumbnail">
                      <a href="#none">
                        <img src={item.listImageUrl} alt={item.name} />
                        {item.sticker && 
                          <div className="Card__sticker">
                            <div className="Card-sticker__box" style={{ backgroundColor: item.sticker.backgroundColor, opacity: `${item.sticker.opacity}%` }}>
                              {item.sticker.content.map((contents, index) => {
                                return (
                                  <span style={{ fontWeight: contents.weight }} key={index}>{contents.text}</span>
                                )
                              })}
                            </div> 
                          </div>
                        }
                      </a>
                      <div className="Card__cart">
                        <button type="button">
                          <img src="https://s3.ap-northeast-2.amazonaws.com/res.kurly.com/kurly/ico/2021/cart_white_45_45.svg" alt="상품 카트에 담기 아이콘" />
                        </button>
                      </div>
                    </div>
                    <div className="Description">
                      <p className="blind">{item.shortDescription}</p>
                      <h3>
                        <a href="#none">{item.name}</a>
                      </h3>
                      {item.discountRate > 0 ?
                        <div className="Price__group">
                          <div className="Price__wrap">
                            <span className="Price__percent">{item.discountRate}%</span>
                            <span className="Price__discount">{item.discountedPrice}원</span>
                          </div>
                          <div className="Price__origin">{item.originalPrice}원</div>
                        </div> :
                        <div className="Price__group">
                          <div className="Price__origin">{item.originalPrice}원</div>
                      </div>}
                    </div>
                  </div>
                </div> 
              )
            })}
          </Slider>
        </div>
      </div>
    </section>
  )
}


export default React.memo(CardList);