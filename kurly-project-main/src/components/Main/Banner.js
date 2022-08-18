import React, {useState, useEffect} from "react";
import axios from 'axios';

import { API } from '../../config';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from 'swiper';
import './Banner.scss'

export default function Banner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setBanner(null);
        // loading 상태를 true 로 바꿉니다.
        const response = await axios.get(API+'main');
        setBanner(response.data.data);
      } catch (e) {
        console.warn(console.log(e));
      }
    }
    fetchBanner();
  }, []);

  return (
    <section>
      <Swiper
        navigation={true}
        pagination={{ type: "fraction" }}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        initialSlide={1}
        modules={[Navigation, Pagination, Autoplay]}
        className="Swiper Main__banner"
      >
        {/* elements 폴더 안에 있는 Image의 내용을 map 돌려 붙여넣기 */
          banner && banner.map(item => {
            return (
              <SwiperSlide key={item.id}>
                <a href="#none"
                  style={{
                    backgroundImage: `url(${item.imageUrl})`
                  }}
                >{item.alt}</a> 
              </SwiperSlide>
            )
          })
       }
       </Swiper>
    </section>
  )
}
