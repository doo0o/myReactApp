import React from "react";

import Sticky from "../components/Sticky"
import Banner from "../components/Main/Banner"
import CardList from "../components/Main/CardList"
import RecipeList from "../components/Main/RecipeList"
import RandomBanner from "../components/Main/RandomBanner"


function Main() {
  return (
    <>
      <Sticky />
      <Banner />
      <CardList
        title="이 상품 어때요?"
        products="data1"
        link={false}
        view={4}
      />
      <RandomBanner number={1}/>
      <CardList
        title="놓치면 후회할 가격"
        products="data2"
        link={true}
        view={4}
      />
      <CardList
        title="마트 갈 시간이 없어요"
        products="data3"
        link={true}
        subtitle="평일 냉장고를 부탁해"
        view={4}
      />
      <CardList
        title="고객 반응으로 입증된 신상품"
        products="data4"
        link={true}
        subtitle="최근 한달 간 장바구니에 많이 담겼어요"
        view={4}
      />
      <CardList
        title="지금 가장 핫한 상품"
        products="data5"
        link={true}
        view={4}
      />
      <RandomBanner number={3}/>
      <CardList
        title="마감세일"
        products="data6"
        link={true}
        view={4}
      />
      <CardList
        title="인기 도시락 메뉴, 김밥"
        products="data7"
        link={true}
        subtitle="도시락 메뉴나 주말 아침식사로 준비해보세요"
        view={4}
      />
      <CardList
        title="30만원 쓰는 화이트의 선택"
        products="data8"
        link={true}
        subtitle="한 달에 30만원 넘게 쓴 고객의 이번주 구매상품"
        view={4}
      />
      <CardList
        title="40대 고객의 구매 TOP50"
        products="data9"
        link={true}
        subtitle="이번주 40대 고객이 특히 많이 구매했어요"
        view={4}
      />
      <RecipeList
        title="컬리의 레시피"
        view={3}
      />
      <RandomBanner number={0}/>
    </>
  )
}

export default Main;