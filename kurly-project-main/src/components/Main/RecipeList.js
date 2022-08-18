import React from "react";
import axios from 'axios';
import useAsync from '../../useAsync';

import { API } from '../../config';

import Slider from "react-slick";
// Import Swiper styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './Card.scss'

async function getRecipe() {
  const response = await axios.get(API+'recipe');
  return response.data;
}

export function RecipeList({ title, view}) {
  const [state, refetch] = useAsync(getRecipe, []);
  const { loading, data: cards, error } = state;

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
              <a href="#none">
                  <span>
                    <span>{title}</span>
                    <span className="ico__arr">
                      <img src="https://s3.ap-northeast-2.amazonaws.com/res.kurly.com/kurly/ico/2021/arrow_title_32_32.svg" alt="더보기 아이콘" />
                    </span>
                  </span>
                </a>
            </h2>
          </div>
          <Slider className="Swiper Card__swiper recipe" {...settings}>
            {cards && cards.map((item, index) => {
              return (
                index < 4 ?
                <div key={item.no}>
                  <div className="Card__slide">
                    <div className="Thumbnail">
                      <a href="#none">
                        <img src={item.imageUrl} alt={item.title} />
                      </a>
                    </div>
                    <h3><a href="#none">{item.title}</a></h3>
                  </div>
                </div> :
                <div key={999999}>
                  <a href="#none" className="ButtonMore">
                      <div className="ButtonMore__box">
                        <span className="ico"></span>
                        <span>전체보기</span>
                      </div>
                  </a>
                </div>
              )
              
            })}
          </Slider>
        </div>
      </div>
    </section>
  )
}


export default React.memo(RecipeList);