$.namespace("common.link");
common.link = {
	/**
	 * 공통 오류 페이지 이동
	 */
	error : function(){
		location.href = _baseUrl + "common/error.do";
	},
	/**
	 * 공통 오류 페이지 변경
	 */
	replaceError : function(){
		window.location.replace("/common/error.do");
	},

	/**
	 * 메인 화면
	 */
	main : function() {
		location.href = _baseUrl + "main/main.do";
	},

	/**
	 * Get Your Genesis
	 */
	subMain : function() {
		location.href = _baseUrl + "disp/subMain.do";
	},

	/**
	 * 차량 PSIP 
	 */
	getPSIPDetail : function(dispCatNo) {
		location.href = _baseUrl + "disp/getPSIPDetail.do?dispCatNo=" + dispCatNo;
	},
	
	mypageMenu : function() {
        location.href = "";
    },

    /**
     * USP 메인
     */
    uspMain : function(carLine, carLineCatNo) {
    	location.href = _baseUrl + "usp/getUspMain.do?carLine=" + carLine + "&carLineCatNo=" + (carLineCatNo != undefined && carLineCatNo != null ? carLineCatNo : "");
    },

    /**
     * 시승신청
     */
    testDriveForm : function(model) {
    	location.href = _baseUrl + "testdrive/viewTestDriveForm.do?model=" + trim(model);
    },
    /**
     * 마이페이지 메인
     */
	moveMyPageMain : function(){
		$(location).attr('href', _baseUrl + "mypage/myPageMain.do");
	},
    /**
     * 내 차고지
     */
	moveMyGarage : function(){
		$(location).attr('href', _baseUrl + "mypage/garage/getMyGarage.do");
	},
	/**
     * 계약신청화면 이동
     */
	moveContractForm : function(cartSeq){
		$(location).attr('href', _baseUrl + "contract/getContractForm.do?cartSeq="+cartSeq);
	},
    /**
     * 계약완료/계약조회 이동
     */
	moveContractComplete : function(contractId){
		$(location).attr('href', _baseUrl + "contract/getContractComplete.do?contractId="+contractId);
	},
    /**
     * 인도지변경 이동
     */
	moveMyContractForm : function(contractId){
		$(location).attr('href', _baseUrl + "mypage/contract/getMyContractForm.do?contractId="+contractId);
	},
    /**
     * 최종 결제 완료 이동
     */
	movePaymentComplete : function(contractId){
		$(location).attr('href', _baseUrl + "payment/getPaymentComplete.do?contractId="+contractId);
	},
    /**
     * 계약취소신청 이동
     */
	moveMyContractCancelReqForm : function(contractId){
		$(location).attr('href', _baseUrl + "mypage/contract/getMyContractCancelReqForm.do?contractId="+contractId);
	},
	
    /**
     * 계약취소신청완료 이동
     */
	moveMyContractCancelReqComplete : function(contractId){
		$(location).attr('href', _baseUrl + "mypage/contract/getMyContractCancelReqComplete.do?contractId="+contractId);
	},
	
	
	/**
	 * 로그인
	 */
	moveLoginPage : function(){
		$(location).attr('href', _baseUrl + "login/loginPage.do?redirectUrl=" + $(location).attr('href'));
	},
	/**
	 * 통합로그인(통합,비회원)
	 */
	moveLogin : function(){
		if (_isLogin) {
			$(location).attr('href', _baseUrl + "login/logout.do?redirectUrl=" + $(location).attr('href'));
		} else {
			$(location).attr('href', _baseUrl + "login/loginPage.do?redirectUrl=" + $(location).attr('href'));
		}
	},
	/**
     * 통합회원로그인
     */
	moveMemberLoginForm : function(){
		$(location).attr('href', _baseUrl + "login/gaCall.do?scope=url.login&redirectUrl="+$("#redirectUrl").val());
	},
	/**
     * 간편회원로그인
     */
	moveNonMemberLoginForm : function(){
		$(location).attr('href', _baseUrl + "login/nonMemberLogin.do?redirectUrl="+$("#redirectUrl").val());
	},
	/**
     * 통합회원가입
     */
	moveMemberJoinForm : function(){
		$(location).attr('href', _baseUrl + "login/authUrlCall.do?uriType=2");
	},
	/**
     * 통합회원아이디찾기
     */
	moveMemberFindForm : function(){
		$(location).attr('href', _baseUrl + "login/gaCall.do?scope=url.find");
	},
	/**
     * 비밀번호인증 화면
     */
	movePwdVerificationForm : function(){
		$(location).attr('href', _baseUrl + "login/pwdVerification.do");
	},
	/**
     * 개인정보수정 화면
     */
	moveMemberModifyForm : function(){
		$(location).attr('href', _baseUrl + "login/getMemberModifyForm.do");
	},
	/**
     * 서비스가입
     */
	moveMemberSignForm : function(){
		$(location).attr('href', _baseUrl + "login/serviceJoinPage.do");
	},
	/**
     * 서비스탈퇴(약관철회)
     */
	moveMemberSignoutForm : function(){
		$(location).attr('href', _baseUrl + "login/getMemberSignoutForm.do");
	},
	/**
     * 통합회원 탈퇴 페이지
     */
	moveMemberSignoutUrlCall : function(){
		$(location).attr('href', _baseUrl + "login/signoutUrlCall.do");
	},
	/**
     * 차량구성 차량모델 화면
     */
    configModel : function() {
    	location.href = _baseUrl + "product/configModel.do";
    },
    /**
     * 차량구성 차량모델 화면
     */
    configDetail : function(carLine) {
    	location.href = _baseUrl + "product/configDetail.do?carLine=" + carLine;
    },
	/**
	 * 차량구성 구성 화면 
	 * @param carLine 차종코드
	 * @param salesSpecGrpCd 판매스펙코드 
	 * @param modelYear 판매스펙코드 모델연식
	 * @param mc MC
	 * @param grade 등급 
	 * @param fsc FSC
	 * @param salesTrim 판매 트림 
	 * @param extColor 외장색상
	 * @param intColor 내장색상
	 * @param optPkgCdVal 옵셥/패키지목록 ","구분자로 문자열로 입력 예) PK0001,PK0003
	 */
    configDetailSet : function(carLine, salesSpecGrpCd, modelYear, mc, grade, fsc, salesTrim, extColor, intColor, optPkgCdVal) {
		location.href = _baseUrl + "product/configDetail.do?carLine=" + carLine + "&salesSpecGrpCd=" + salesSpecGrpCd + "&mc=" + mc + "&grade=" + grade + "&fsc=" + fsc + "&salesTrim=" + salesTrim + "&extColor=" + extColor + "&intColor=" + intColor + "&modelYear=" + modelYear + "&optPkgCdVal=" + optPkgCdVal; 
	},
	/**
     * 1:1 문의 이동
     */
	moveConsultForm : function(){
		$(location).attr('href', _baseUrl + "support/consult/getConsultForm.do");
	},
	/**
	 * trade in 이동
	 */
	moveTradeIn : function() {
		$(location).attr('href', _baseUrl + "tradein/tradeInInfo.do");
	},
	/**
	 * finace 중국현대캐피탈
	 */
	moveFinance : function() {
		window.open("http://www.bhaf.com.cn/");
	},
	/**
     * Fleet 이동
     */
	moveFleetForm : function(){
		$(location).attr('href', _baseUrl + "support/consult/getFleetForm.do");
	},
	/**
     * 지점찾기 이동
     */
	moveDepartmentList : function(){
		$(location).attr('href', _baseUrl + "support/department/getDepartmentList.do");
	},
	/**
     * FAQ 이동
     */
	moveFaqList : function(){
		$(location).attr('href', _baseUrl + "support/faq/getFaqList.do");
	},
	/**
     * News 이동
     */
	moveNewsList : function(){
		$(location).attr('href', _baseUrl + "board/getNewsList.do");
	},
	/**
     * Special Offers 이동
     */
	moveSpecialOffers : function(){
		$(location).attr('href', _baseUrl + "support/spcialOfferList.do");
	},
	/**
     * Review 이동
     */
	moveReviewList : function(){
		$(location).attr('href', _baseUrl + "board/getReviewList.do");
	},
    /**
     * 마이페이지 나의시승이력
     */
	moveMyTestDriveList : function(){
		$(location).attr('href', _baseUrl + "mypage/testdrive/viewMyTestDriveList.do");
	},
	/**
	 * 차량 목록 화면
	 */
	moveProductList : function(dispCatNo) {
		location.href = _baseUrl + "disp/productList.do?dispCatNo=" + dispCatNo;
	},
	/**
	 * 차량 목록 화면 - 차종 / 스펙그룹코드
	 */
	moveProductListByCarLine : function(carLine, salesSpecGrpCd) {
		location.href = _baseUrl + "disp/redirectProductList.do?carLine=" + carLine + "&salesSpecGrpCd=" + salesSpecGrpCd;
	},
	/**
	 * 차량상세화면으로 이동 
	 * @param carLine 차종코드
	 * @param salesSpecGrpCd 판매스펙코드 
	 * @param modelYear 판매스펙코드 모델연식
	 * @param mc MC
	 * @param grade 등급 
	 * @param fsc FSC
	 * @param salesTrim 판매 트림 
	 * @param extColor 외장색상
	 * @param intColor 내장색상
	 * @param optPkgCdVal 옵셥/패키지목록 ","구분자로 문자열로 입력 예) PK0001,PK0003
	 */
	moveProductDetail : function(carLine, salesSpecGrpCd, modelYear, mc, grade, fsc, salesTrim, extColor, intColor, optPkgCdVal) {
		location.href = _baseUrl + "product/detailInfoLayer.do?carLine=" + carLine + "&salesSpecGrpCd=" + salesSpecGrpCd + "&mc=" + mc + "&grade=" + grade + "&fsc=" + fsc + "&salesTrim=" + salesTrim + "&extColor=" + extColor + "&intColor=" + intColor + "&modelYear=" + modelYear + "&optPkgCdVal=" + optPkgCdVal; 
	},
	/**
	 * PSIP 페이지 이동
	 */
	movePsipDetail : function(carLine) {
		location.href = _baseUrl + "disp/getPSIPDetail.do?carLine=" + carLine;
	},
	
	/**
	 * copyright 이동
	 */
	moveCopyRight : function() {
		location.href = _baseUrl + "support/copyRight.do";
	},
	
	/**
	 * 보증안내이동
	 */
	moveWarranty : function() {
		location.href = _baseUrl + "support/warranty.do";
	},
	
	/**
	 * 개인정보취급방침이동 
	 */
	movePolicyGeneral : function() {
		location.href = _baseUrl + "support/policyGeneral.do";
	},
	
	/**
	 * 이용약관이동
	 */
	moveTermsCondition : function() {
		location.href = _baseUrl + "support/termsCondition.do";
	},
	
	/**
	 * 사이트맵이동
	 */
	moveSiteMap : function() {
		location.href = _baseUrl + "support/siteMap.do";
	},
	/**
	 * 계약 배송 지연 화면으로 이동
	 */
	moveContractDeliveryDelayFrom : function(cartSeq){
		location.href = _baseUrl + "contract/getDeliveryDelayForm.do?cartSeq="+cartSeq;
	},
	/**
	 * 계약 확인 안내 화면으로 이동
	 */
	moveContractConfirm : function(){
		location.href = _baseUrl + "contract/getContractConfirm.do";
	},
	/**
	 * 계약 확인 안내 화면으로 변경
	 */
	replaceContractConfirm : function(){
		window.location.replace("/contract/getContractConfirm.do");
	},
	/**
	 * 결제 확인 안내 화면으로 이동
	 */
	movePaymentConfirm : function(){
		location.href = _baseUrl + "payment/getPaymentConfirm.do";
	},
	/**
	 * 결제 확인 안내 화면으로 변경
	 */
	replacePaymentConfirm : function(){
		window.location.replace("/payment/getPaymentConfirm.do");
	},
	
	moveBrandSite : function() {
		window.open("http://www.genesis.com");
	},
	
};