import React from "react";
import axios from 'axios';
import useAsync from '../../useAsync';

import { API } from '../../config';
import './Card.scss'

async function getRandomBanner() {
  const response = await axios.get(API+'randombanner');
  return response.data;
}

export function RandomBanner({ number }) {
  const [state, refetch] = useAsync(getRandomBanner, []);
  const { loading, data: cards, error } = state;
  return (
    <section>
      <div className="Main__card">
        <div className="Card__wrap" key={cards && cards[number].no}>
          <a href="#none" className="" style={{backgroundColor:cards && cards[number].backgroundColor}}>
            <img src={cards && cards[number].imageUrl} alt="배너" />
          </a>
        </div>
      </div>
    </section>
  )
}


export default React.memo(RandomBanner);