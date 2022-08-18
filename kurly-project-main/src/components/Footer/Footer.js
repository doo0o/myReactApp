import React from "react";
import styles from './Footer.module.scss'
const Footer = () => {
  return (
    <footer className={styles.Wrapper}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <div className={styles.cc__info}>
            <h2>고객행복센터</h2>
            <div className={styles.cc__view}>
              <ul>
                <li>
                  <div className={styles.cc__tit}><span>1644-1107</span></div>
                  <dl>
                    <dt>365고객센터</dt>
                    <dd>오전 7시 - 오후 7시</dd>
                  </dl>
                </li>
                <li>
                  <div className={styles.cc__tit}><a href="#none">카카오톡 문의</a></div>
                  <dl>
                    <dt>365고객센터</dt>
                    <dd>오전 7시 - 오후 7시</dd>
                  </dl>
                </li>
                <li>
                  <div className={styles.cc__tit}><a href="#none">1:1 문의</a></div>
                  <dl>
                    <dt>24시간 접수 가능</dt>
                    <dd>고객센터 운영시간에 순차적으로 답변해드리겠습니다.</dd>
                  </dl>
                </li>
                <li>
                  <div className={styles.cc__tit}><a href="#none">대량주문 문의</a></div>
                  <p>비회원일 경우 메일로 문의 바랍니다.</p>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.cp__wrap}>
            <ul className={styles.cp__navigation}>
              <li><a href="#none">컬리소개</a></li>
              <li><a href="#none">컬리소개영상</a></li>
              <li><a href="#none">인재채용</a></li>
              <li><a href="#none">이용약관</a></li>
              <li><a href="#none"><b>개인정보처리방침</b></a></li>
              <li><a href="#none">이용약관</a></li>
            </ul>
            <div className={styles.cp__info}>
              <p>법인명 (상호) : 주식회사 컬리 <span className={styles.bar}>I</span> 사업자등록번호 : 261-81-23567 <a href="#none" className={styles.link}>사업자정보 확인</a></p>
              <p>통신판매업 : 제 2018-서울강남-01646 호 <span className={styles.bar}>I</span> 개인정보보호책임자 : 이원준</p>
              <p>주소 : 서울특별시 강남구 테헤란로 133, 18층(역삼동) <span className={styles.bar}>I</span> 대표이사 : 김슬아</p>
              <p>입점문의 : <a href="#none" className={styles.link}>입점문의하기</a> <span className={styles.bar}>I</span> 마케팅제휴 : <a href="#none" className={styles.link}>business@kurlycorp.com</a></p>
              <p>채용문의 : <a href="#none" className={styles.link}>recruit@kurlycorp.com</a></p>
              <p>팩스: 070 - 7500 - 6098 <span className={styles.bar}>I</span> 이메일 : <a href="#none" className={styles.link}>help@kurlycorp.com</a></p>
              <p>대량주문 문의 : <a href="#none" className={styles.link}>kurlygift@kurlycorp.com</a></p>
            </div>

            <ul className={styles.cp__sns}>
              <li>
                <a href="#none"><img src="https://res.kurly.com/pc/ico/1810/ico_instagram.png" alt="마켓컬리 인스타그램 바로가기" /></a>
              </li>
              <li>
                <a href="#none"><img src="https://res.kurly.com/pc/ico/1810/ico_fb.png" alt="마켓컬리 페이스북 바로가기" /></a>
              </li>
              <li>
                <a href="#none"><img src="https://res.kurly.com/pc/ico/1810/ico_blog.png" alt="마켓컬리 네이버블로그 바로가기" /></a>
              </li>
              <li>
                <a href="#none"><img src="https://res.kurly.com/pc/ico/1810/ico_naverpost.png" alt="마켓컬리 유튜브 바로가기" /></a>
              </li>
              <li>
                <a href="#none"><img src="https://res.kurly.com/pc/ico/1810/ico_youtube.png" alt="마켓컬리 유튜브 바로가기" /></a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.cp__auth}>
          <a href="#none" className={styles.cp__link}>
            <img src="https://res.kurly.com/kurly/logo/isms_220310.png" alt="isms 로고" className={styles.logo} />
            <p className={styles.txt}>[인증범위] 마켓컬리 쇼핑몰 서비스 개발·운영<br/>(심사받지 않은 물리적 인프라 제외)<br/> [유효기간] 2022.01.19 ~ 2025.01.18</p>
          </a>
          <a href="#none" className={styles.cp__link}>
            <img src="https://res.kurly.com/pc/ico/2001/logo_eprivacyplus.png" alt="isms 로고" className={styles.logo} />
            <p className={styles.txt}>개인정보보호 우수 웹사이트 ·<br/>개인정보처리시스템 인증 (ePRIVACY PLUS)</p>
          </a>
          <a href="#none" className={styles.cp__link}>
            <img src="https://res.kurly.com/pc/service/main/2009/logo_payments.png" alt="isms 로고" className={`${styles.logo} ${styles.long}`} />
            <p className={styles.txt}>고객님의 안전거래를 위해 현금 등으로 결제 시 저희 쇼핑몰에서 가입한<br/>토스 페이먼츠 구매안전(에스크로) 서비스를 이용하실 수 있습니다.</p>
          </a>
        </div>
      </div>

      <div className={styles.cp__rights}>
        <p className={styles.txt}>마켓컬리에서 판매되는 상품 중에는 마켓컬리에 입점한 개별 판매자가 판매하는 마켓플레이스(오픈마켓) 상품이 포함되어 있습니다.</p>
        <p className={styles.txt}>마켓플레이스(오픈마켓) 상품의 경우 컬리는 통신판매중개자로서 통신판매의 당사자가 아닙니다. 컬리는 해당 상품의 주문, 품질, 교환/환불 등 의무와 책임을 부담하지 않습니다.</p>
        <em className={styles.copy}>© KURLY CORP. ALL RIGHTS RESERVED</em>
      </div>
    </footer>
  )
}
export default Footer;