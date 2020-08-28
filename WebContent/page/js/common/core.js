var common = {};
(function($) {

	common.readyList = [];
	
	common.readySecondaryList = [];

	common.readyCompleteList = [];
	
	/**
	 * 페이지에 이미지등을 제외한 모든 엘리먼트가 로딩된 다음 처리할 초기화 함수를 지정한다.
	 * @param {Function} 초기화시 호출될 함수
	 * @return 없음
	 */
	common.onLoad = function(fn) {
		if(jQuery.isReady) {
			$(fn);
		}
		else {
			common.readyList.push(fn);
		}
	};

	common.onLoadComplete = function(fn) {
		if(jQuery.isReady) {
			$(fn);
		}
		else {
			common.readyCompleteList.push(fn);
		}
	};

	/**
	 * 페이지 새로고침 함수
	 * @param {document} document
	 * @param {String} URL
	 * @param {boolean} 상태 표시 여부
	 */
	common.reload = function(doc, isStatusBar) {
		doc = doc || document;
		isStatusBar = common.isUndefined(isStatusBar) ? true : isStatusBar;
		
		if(isStatusBar) {
			common.showStatusBar(doc);
		}
		doc.location.reload();
	};
	
	/**
	 * 현재 활성화 되어 있는 화면을 닫는다.
	 */
	common.close = function() {
		window.close();
	};

	/**
	 * 페이지 이동 함수
	 * @param {String} URL
	 * @param {document} document
	 * @param {boolean} 상태 표시 여부
	 */
	common.moveLocation = function(url, doc, isStatusBar) {		
		url = common.isScreenId(url) ? common.getScreenURL(url) : url;		
		doc = doc || document;
		if($('body', doc).size() == 0){
			doc = doc.document;
			if($('body', doc).size() == 0){
				//빠르게 마구 누를 때 아래 주석된 alert 메세지가 호출 되는 경우가 발생합니다.(김태완)
				//alert('common.moveLocation의 doc 파라미터가 document or Window 인스턴스가 아닙니다.\호출 코딩을 확인해주세요.');
				return;
			}
		}
		
		isStatusBar = common.isUndefined(isStatusBar) ? true : isStatusBar;
		if(isStatusBar) {			
			common.showStatusBar(doc);
		}

		url = common.setLayoutParameter(url);
		doc.location.href = url;
	};

	common.popupRegistry = [];
	/**
	 * 팝업 함수
	 * @param {String} target
	 * @param {String} URL or screen id
	 * @param {json} Options
	 *            location, menubar, resizable, resizable, scrollbars, status, titlebar 는 [yes,no]로 설정
	 *            height, width, top, left 는 [픽셀로 설정]
	 *            ex)  {resizable:yes,width:300,height:400}   
	 * @param {Function} 팝업창으로 부터 데이타 전송시 실행될 함수, 팝업창으로 전달받은 data를 함수 인자로 받는다.
	 * 
	 */
	common.openWindow = function(target, url, option, listner) {
		target = (target || 'Popup').replace(".", "");			
		if(option.resizable == 'yes') {
			url = common.addQueryToUrl(url , 'popup_resizable', 'yes');
		}
		
		if(common.popupRegistry[target] == null 
				|| common.popupRegistry[target].win == null
				|| common.popupRegistry[target].win.closed) {
			url = common.isScreenId(url) ? common.getScreenURL(url) : url;
			
			option = $.extend({
				top: -1, left: -1,
				location: 'no', menubar: 'no', resizable: 'no', scrollbars: 'no', status: 'no', titlebar: 'no',
				height: 400, width: 600
			}, option || {});
			
			if(option.top < 0) {
				// fixed bugs : 1.2.2 : Set position center of screen height. 
				if(common.isString(option.height)){
					option.height = option.height.replace('px', '');
					option.height = parseInt(option.height, 10);
				}
				option.top = (screen.availHeight / 2 - option.height / 2);
			}
			if(option.left < 0) {
				// fixed bugs : 1.2.2 : Set position center of screen width.
				if(common.isString(option.width)){
					option.width = option.width.replace('px', '');
					option.width = parseInt(option.width, 10);
				}
				option.left = (screen.availWidth / 2 - option.width / 2);
			}
			
			var param = '';
			for(op in option) {
				param += op + '=' +  option[op] + ',';
			}
			
			var pop = window.open(url, target, param);
			return common.popupRegistry[target] = {
				win: pop,
				listner: listner || $.noop
			};
		}
		else {
			
			common.moveLocation(url, common.popupRegistry[target].win, false);
			common.popupRegistry[target].win.focus();
			return common.popupRegistry[target];
		}
		
	};
	
	/**
	 * 화면 호출 URL을 만들어줍니다.
	 * @param {String} 요청할 화면 ID
	 * @param {String} 요청할 화면의 레이아웃
	 * @return {String} 화면을 호출하기 위한 URL
	 */
	common.getScreenURL = function(id, layout) {
		if(common.isBlank(id)) {
			id = _SCREEN_ID;
		}
		
		var url = common.getContextURL('/' + common.CONSTANT.PATH.SCREEN + '/' + id + '.' + common.CONSTANT.URL_EXTENTION);
		if(common.isEmpty(layout)) {
			return url;
		}else{
			return common.addQueryToUrl(url, common.CONSTANT.CALL_LAYOUT, layout);
		}
	};
	
	/**
	 * 화면 ID 여부 조사
	 * @param {String} 조사 대상 문자열
	 * @return {Boolean} true 화면ID 패턴일 경우
	 */
	common.isScreenId = function(path) {
		if(common.isBlank(path)) {
			return false;
		}
		
		return /^[A-Z]{3}[0-9]{4}/.test(path);
	};
	
	/**
	 * 화면 요청 URL 여부 조사
	 * @param {String} 조사 URL
	 * @return {Boolean} true 서비스 요청 URL 패턴일 경우
	 */
	common.isScreenRequestPath = function(path) {
		if(common.isBlank(path)) {
			return false;
		}
		
		var screenPath = common.getContextURL('/' + common.CONSTANT.PATH.SCREEN + '/');
		return path.match(screenPath);
	};
	
	/**
	 * URL로 부터 화면 ID 추출
	 * @param {String} URL
	 * @return {String} 화면 ID
	 */
	common.getScreenIdFromPath = function(path) {
		var matched = path.match(/[A-Z]{3}[0-9]{4}/);
		if(matched) {
			return matched[0];
		}
		return null;
	};
	
})(jQuery);