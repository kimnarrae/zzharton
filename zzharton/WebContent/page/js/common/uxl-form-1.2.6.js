/*! 
 * Copyright (c) 2014 UBONE (http://www.ubqone.com)
 * 
 * File : uxl-form-1.2.6.js
 * Version 1.2.6
 * Release List
 * 
 * 1.2.6 - 2019-03-06
 *   - 중복로그인으로 강제 로그아웃이 될경우 메세지 처리
 *     {0}({1})에서 중복 로그인하여 강제로 로그아웃되었습니다.
 * 1.2.5 - 2018-11-28
 *   - ajax 호출시 서비스 내부오류가 발생할 경우 시스템 오류에 대한 메세지를 표출하도록 수정함.
 * 1.2.4 - 2017-04-19
 *   - uxl.loadPage 함수 추가, uxl.load 함수는 Defrecate로 지정함.
 * 1.2.3 - 2016-08-05
 *   - 로딩바 변경
 * 1.2.2 - 2015-11-22
 * 	 - Form 전송시 특정컬럼의 암호화 처리후 전송 적용 (jCryption Lib 추가)
 * 1.2.1 - 2015-08-28
 *   - 멀티 View 제공 화면의 검색조건 독립성 보장을 위해
 *   - Ajax로 Form Submit할 경우 _window_name 파라미터를 추가하여 현재 window명을 전송한다. (검색조건 복원에 사용함)
 * 1.1.1 - 2014-07-10
 *   - Ajax 호출시 서버 오류에 따른 처리 보완
 *     1) 서버가 Down 되었을 경우 클라이언트의 잔상으로 남은 화면에서 요청시 오류에 대한 처리
 *     2) Session TimeOut이 되었을 경우 로그인 페이지로 이동하도록 Alert과 화면 이동 기능 추가  
 */
(function($, uxl) {
	
	/**
	 * 폼을 생성한다.
	 * @param {Document} doc 폼이 생성될 도큐먼트 객체
	 * @param {String} name 폼 이름
	 * @return {Form} 폼 엘리먼트
	 */
	uxl.createForm = function (doc, name) {
		doc = doc || document;
		
		if($('body form[name=' + name + ']', doc).size() == 0) {
			$('body', doc).append('<form id="' + name + '" name="' + name + '" style="display:none" method="post"></form>');
			return doc.forms[name];
		}
		else {
			return $('body form[name=' + name + ']', doc).get(0);
		}
	};
	
	/**
	 * Hidden 타입의 Input 엘리먼트를 추가합니다.
	 * @param {Form} form 폼 객체
	 * @param {String} name Input 엘리먼트 이름
	 * @param {String} value Input 엘리먼트 값
	 * @param {Boolean} isMultiLine 멀리라인 모드
	 * @return 없음
	 */
	uxl.addHidden = function (form, name, value, isMultiLine) {
		isMultiLine = uxl.isUndefined(isMultiLine) ? false : isMultiLine;
		var hidden;
		if(isMultiLine) {
			hidden = $('<textarea style="width:0px;height:0px"></textarea>');
		}
		else {
			hidden = $('<input type="hidden"></input>');
		}
		hidden.attr('id', name).attr('name', name).attr('value', value).appendTo(form);
	};

	
	uxl.validations = {
	};
	uxl.validation_prefix = 'validation_';
	uxl.addValidation = function(key, fn) {
		uxl.validations[uxl.validation_prefix + key] = fn;
	};
	uxl.removeValidation = function(key) {
		uxl.validations[uxl.validation_prefix + key] = function() {
			return true;
		};
	};
	/**
	 * 기본 입력 검증.<br/>
	 *  - 필수 항목, 자리수 등의 기본 입력값을 검증한다.
	 * @param {Form|Form Input Element|String} form 필수항목 체크를 할 폼 객체 또는 폼 객체의 이름을 지정합니다.
	 * @return {Boolean} true when exist not allowed input
	 * @see uxl-form-1.1.0.js
	 */
	uxl.validateBasicInput = function(target) {
		var check = uxl.checkRequiredFields(target);
		if(check) {
			$.each(uxl.validations, function(index, item) {
				check = this.call(target);
				return check;
			});
		}
		return check;
	};
	
	/**
	 * 필수항목을 체크합니다.<br/>
	 * @param {Form|Form Input Element|String} form 필수항목 체크를 할 폼 객체 또는 폼 객체의 이름을 지정합니다.
	 * @return {Boolean} 입력되지 않은 필수 항목이 있는 경우 false 를 반환합니다.
	 * @see uxl-form-1.1.0.js
	 */
	uxl.checkRequiredFields = function(target) {	
		target = target || document;
		if (uxl.isString(target)) {
			target = document.forms[target];
		}
		
		var check = true;
		var messageTitle = uxl.getMessage('label.common.check');
		
		$(target).find("*[metaessential='1']").each(function() {
			
			if(uxl.isBlank($(this).fieldValue(false))) {
				check = false;

				var fieldText = "";
				if($('label[for=' + this.id + ']').size() > 0){
					fieldText = uxl.trim($('label[for=' + this.id + ']').text());
				}
				else {
					if(uxl.isNotEmpty($(this).attr('metafield'))) {
						fieldText  = $(this).attr('metafield');
					}
					else {
						fieldText = uxl.trim($('label[for*=' + this.id + ']').text());
					}
				}
				
				if(window.top && window.top.uxl) {
					window.top.uxl.showMessage(uxl.getMessage('message.common.validation.required', fieldText), uxl.getRequireErrorFunction(this), messageTitle);
				}
				else {
					uxl.showMessage(uxl.getMessage('message.common.validation.required', fieldText), uxl.getRequireErrorFunction(this), messageTitle);
				}
				return false;
			}
		});

		return check;
	};
	
	/**
	 * 필수항목 에러 처리 함수 생성
	 * @param {Form input element || String} error element or jquery selector statement
	 * @return {Function} 
	 * @see uxl-form-1.1.0.js
	 */
	uxl.getRequireErrorFunction = function(targetElement) {
		return function () {
			$(targetElement)
			.addClass('ui-state-error')
			.focus()
			.bind('blur.validation.required change.validation.required', function() {
				if($(this).val() != '') {
					$(this).removeClass('ui-state-error').unbind('.validation.required');
				}
			});
		};
	};
	
	/**
	 * 필수항목 에러 처리 함수 생성
	 * @param {Form input element || String} error element or jquery selector statement
	 * @return {Function} 
	 * @see uxl-form-1.1.0.js
	 */
	uxl.getInvalidValueErrorFunction = function(targetElement) {
		return function () {
			var prevValue = $(targetElement).val();
			$(targetElement)
			.addClass('ui-state-error')
			.focus()
			.bind('blur.validation.invalid change.validation.invalid', function() {
				if($(this).val() != prevValue) {
					$(this).removeClass('ui-state-error').unbind('.validation.invalid');
				}
			});
		};
	};
	
	/**
	 * 잘못된 값 에러 처리 함수 생성
	 * @param {Form input element || String} error element or jquery selector statement
	 * @return {Function} 
	 * @see uxl-form-1.1.0.js
	 */
	uxl.getNotAllowedValueErrorFunction = function(targetElement) {
		return function () {
			$(targetElement)
			.addClass('ui-state-error')
			.focus()
			.change(function() {
				$(this).removeClass('ui-state-error');
			});
		};
	};

	/**
	 * 폼 submit
	 * @param {String|Form element} form name or form element
	 * @param {String} screenId or target url
	 * @param {String} submit target(default:_self)
	 * @param {Function} 전송하기 전에 호출 할 함수. 해당 함수가 false 를 반환할 경우 취소
	 * @param {boolean} 상태 표시 여부
	 * @return 없음
	 */
	uxl.submit = function(targetForm, url, target, beforeSubmit, isStatusBar) {
		targetForm = targetForm || '';
		targetForm = uxl.isString(targetForm) ? document.forms[targetForm] : targetForm;
		
		if(targetForm == null) {
			uxl.debug('submit taget form is null ((uxl.submit))');
			return false;
		}
		
		if(uxl.isEmpty(url)) {
			uxl.debug('submit url is null ((uxl.submit))');
			return false;
		}
		
		target = target || '_self';
		beforeSubmit = beforeSubmit || function() {
			return true;
		};
		
		if(uxl.isScreenId(url)) {
			url = uxl.getScreenURL(url);
		}
		
		url = uxl.setLayoutParameter(url);
		
		if(beforeSubmit()) {
			isStatusBar = uxl.isUndefined(isStatusBar) ? true : isStatusBar;
			if(isStatusBar) {
				uxl.showStatusBar();
			}
			
			targetForm.method = 'POST';
			targetForm.target = target;
			targetForm.action = url;
			targetForm.submit();
			return false;
		}
	};
	
	/**
	 * 검색 버튼 설정
	 * @param {String} 화면 ID
	 * @param {String} 검색버튼 ID
	 * @param {String} 검색 form 이름.
	 * @param {Function} 전송하기 전에 호출 할 함수. 해당 함수가 false 를 반환할 경우 취소
	 * @return 없음
	 
	uxl.bindDoSearch = function(screenId, buttonId, formName, beforeSearch) {
		screenId = screenId || _SCREEN_ID;
		buttonId = buttonId || uxl.CONSTANT.BUTTON.SEARCH;
		formName = formName || uxl.CONSTANT.FORM.SEARCH;
		
		var doSubmit = function(event) {			
			var eventDoc = event.target.ownerDocument;
			var searchForm = eventDoc.forms[formName];
			// 조회조건에 멀티 Select가 존재시 하위 options을 모두 선택한다.
			$('select[multiple=true] option', $('#searchForm')).attr("selected","selected");
			uxl.submit(searchForm, screenId, null, beforeSearch);
		};
		
		$('#' + buttonId)
		.click(function(event) {
			event.preventDefault();
			doSubmit(event);
		})
		.keypress(function(event) {
			if(event.which == '13') {
				event.preventDefault();
				doSubmit(event);
			}
		});
	};
	*/
	
	
	/**
	 * 페이징 기능 설정
	 * @param {String} 검색 form 이름.
	 * @return 없음
	
	uxl.bindDoPaging = function(formName) {
		formName = formName || uxl.CONSTANT.FORM.SEARCH;
		
		$('.ub-layout.pagging a[param]').click(function(event) {
			var eventDoc = event.target.ownerDocument;
			var searchForm = eventDoc.forms[formName];
			if(searchForm != null) {
				
				var params = $(event.target).attr('param').split(':');
				uxl.addHidden(searchForm, _KEY_PAGE_NUMBER, params[0]);
				uxl.addHidden(searchForm, _KEY_PAGE_BLOCK, params[1]);
				uxl.addHidden(searchForm, 'ORDER_COLUMN', orderColumn);
				uxl.addHidden(searchForm, 'ORDER_ASC', orderAsc);
			}
			
			// 조회조건에 멀티 Select가 존재시 하위 options을 모두 선택한다.
			$('select[multiple=true] option', $(searchForm)).attr("selected","selected");
			
			url = location.href;
			url = url.replace(uxl.CONSTANT.KEY.RECOVERY, uxl.CONSTANT.KEY.RECOVERY + '_invalid');
			uxl.submit(searchForm, url);
		});
	};
	 */
	
	/**
	 * 등록 화면 이동 기능 설정
	 * @param {String} 화면 ID
	 * @param {String} 버튼 ID
	 * @param {document} 이동 대상 document
	 * @return 없음
	 
	uxl.bindGoRegister = function(screenId, buttonId, targetDocument) {
		buttonId = buttonId || uxl.CONSTANT.BUTTON.NEW;
		$('#' + buttonId).click(function(event) {
			targetDocument = targetDocument || event.target.ownerDocument;
			var url = uxl.getScreenURL(screenId);
			uxl.moveLocation(url, targetDocument);
		});
	};
	*/
	
	/**
	 * 등록 화면 이동 기능 설정
	 * @param {String} 화면 ID
	 * @param {String} 버튼 ID
	 * @param {Object} uxl.openWindow option
	 * @return 없음
	
	uxl.bindGoRegisterPopup = function(screenId, buttonId, option, listner) {
		buttonId = buttonId || uxl.CONSTANT.BUTTON.NEW;
		
		var windowName = 'Popup';
		if(uxl.isUndefined(screenId) || screenId == null || screenId == '') {
			uxl.debug('screenId is null ((uxl.bindGoRegisterPopup))');
			return false;
		}
		
		var url = screenId;
		if(uxl.isScreenId(url)) {
			url = uxl.getScreenURL(url);
		}
		
		if(uxl.isScreenRequestPath(url)) {
			windowName = uxl.getScreenIdFromPath(url);
		}
		
		$('#' + buttonId).click(function(event) {
			uxl.openWindow(windowName, url, option, listner);
		});
	};
	
	 */
	
	/**
	 * 상세 화면 이동 기능 설정
	 * @param {String} 화면 ID
	 * @param {String} 기능 부여 대상 셀렉트 구문
	 * @param {String|Array} primary Key name
	 * @param {document} 이동 대상 document
	 * @return 없음
	 
	uxl.bindGoDetail = function(screenId, listSelector, primaryKeyAttributeNames, targetDocument) {
		listSelector = listSelector || uxl.CONSTANT.LIST_ITEM_SELECTOR;
		
		$(listSelector).click(function(event) {
			var url = uxl.getScreenURL(screenId);
			primaryKeyAttributeNames = primaryKeyAttributeNames || uxl.CONSTANT.KEY.PRIMARY;
			if(uxl.isArray(primaryKeyAttributeNames)) {
				$.each(primaryKeyAttributeNames, function(index, item) {
					var key = $(this).attr(item);
					if(uxl.isEmpty(key)) {
						key = $(this).parent().attr(item);
					}
					url = uxl.addQueryToUrl(url, item, key);
				});
			}
			else if(uxl.isString(primaryKeyAttributeNames)) {
				var key = $(this).attr(primaryKeyAttributeNames);
				if(uxl.isEmpty(key)) {
					key = $(this).parent().attr(primaryKeyAttributeNames);
				}
				if(uxl.isEmpty(key)) {
					key = $(this).attr("id");
				}
				if(uxl.isEmpty(key)) {
					key = $(this).parent().attr("id");
				}
				url = uxl.addQueryToUrl(url, primaryKeyAttributeNames, key);
			}
			targetDocument = targetDocument || event.target.ownerDocument;
			uxl.moveLocation(url, targetDocument);
		});
	};
	*/
	
	
	/**
	 * 팝업 상세 화면 이동 기능 설정
	 * @param {String} url or 화면 ID
	 * @param {String} 기능 부여 대상 jquery 셀렉트 구문
	 * @param {String|Array} primary Key name
	 * @param {Object} uxl.openWindow option
	 * @param {Function} 팝업창으로 부터 데이타 전송시 실행될 함수, 팝업창으로 전달받은 data를 함수 인자로 받는다.
	 * @return 없음
	
	uxl.bindGoDetailPopup = function(url, listSelector, primaryKeyAttributeNames, option, listner) {
		listSelector = listSelector || '#main_list td.value';
		var windowName = 'Popup';
		if(uxl.isEmpty(url)) {
			uxl.debug('popup url is null ((uxl.bindGoDetailPopup))');
			return false;
		}
		
		if(uxl.isScreenId(url)) {
			url = uxl.getScreenURL(url);
		}
		
		if(uxl.isScreenRequestPath(url)) {
			windowName = uxl.getScreenIdFromPath(url);
		}
		
		$(listSelector).click(function(event) {
			var popupUrl = url;
			var thisObject = this;
			primaryKeyAttributeNames = primaryKeyAttributeNames || uxl.CONSTANT.KEY.PRIMARY;
			if(uxl.isArray(primaryKeyAttributeNames)) {
				$.each(primaryKeyAttributeNames, function(index, item) {
					var key = $(thisObject).attr(item);
					if(uxl.isEmpty(key)) {
						key = $(thisObject).parent().attr(item);
					}
					popupUrl = uxl.addQueryToUrl(popupUrl, item, key);
				});
			}
			else if(uxl.isString(primaryKeyAttributeNames)) {
				var key = $(this).attr(primaryKeyAttributeNames);
				if(uxl.isEmpty(key)) {
					key = $(this).parent().attr(primaryKeyAttributeNames);
				}
				popupUrl = uxl.addQueryToUrl(popupUrl, primaryKeyAttributeNames, key);
			}
			
			uxl.openWindow(windowName, popupUrl, option, listner);
		});
	};
	 */
	
	/**
	 * 목록 돌아가기 버튼 설정
	 * @param {String} 화면 ID
	 * @param {String} 목록 버튼 ID
	 * @param {document} 이동 대상 document
	 * @return 없음
	
	uxl.bindGoList = function(screenId, buttonId, targetDocument) {
		buttonId = buttonId || uxl.CONSTANT.BUTTON.LIST;

		if(uxl.isEmpty(screenId)) {
			uxl.debug('list url[or screen id] is null ((uxl.bindGoList))');
			return false;
		}
		var url = uxl.isScreenId(screenId) ? uxl.getScreenURL(screenId) : screenId;
		url = uxl.addQueryToUrl(url, uxl.CONSTANT.KEY.RECOVERY, uxl.CONSTANT.RECOVERYCOMMAND.RECOVERY);
		
		$('#' + buttonId).click(function(event) {
			targetDocument = targetDocument || event.target.ownerDocument;			
			uxl.moveLocation(url, targetDocument);
		});
	};
	 */

	/**
	 * code-text 타입 관련 컨트롤 내용지우기
	 * @param {String} 컨트롤명
	 * @return 없음
	 */	
	uxl.ClearValue = function(cid){ 
		cid = cid + "^END";
		pName = cid.split("^");

		for (var i=0;i<pName.length-1;i++){
			$('#'+pName[i]).val('');
		}
	};
	
	
	/**
	 * UXL Page 객체
	 *  - 화면의 Function 관리
	 */
	uxl.Page = {
		screenFunctions: _SCREEN_FUNCTIONS
	};
	
	/**
	 * 기능 사용 가능 여부
	 * @param {String} Function ID or Function Alias
	 * @return 사용 가능 여부
	 */
	uxl.Page.canDoit = function(functionId) {
		var screenFunction = uxl.Page.Util.findScreenFunction(functionId);
		if(uxl.isNull(screenFunction)) {
			return false;
		}
		if(uxl.isEmpty(screenFunction.tokenKey)) {
			return false;
		}
		return true;
	};
	
	/**
	 * 사용자의 기능에 대한 권한레벨
	 * @param {String} Function ID or Function Alias
	 * @return 권한 레벨
	 */
	uxl.Page.getAuth = function(functionId) {
		var screenFunction = uxl.Page.Util.findScreenFunction(functionId);
		if(uxl.isNull(screenFunction)) {
			return null;
		}
		return screenFunction.authorityLevel;
	};
	
	/**
	 * 기능과 target을 연동하여 권한이 없을 경우의 처리를 실행
	 * @param {String} Function ID or Function Alias
	 * @param {String || element || jquery array} 기능관 연동된 target
	 * @param {String || function} (hide|disable) 권한없을 경우 실행될 처리
	 * @return 권한 레벨
	 */
	uxl.Page.syncTargetWithAuth = function(functionId, target, action) {
		action = action || 'remove';
		// target 값이 String 일 경우 이벤트가 발생될 element id 로 판단  
		target = uxl.isString(target) ? $('#' + target) : $(target);
		
		if(uxl.Page.canDoit(functionId) == false && uxl.CONSTANT.SECURITY.ENABLED) {
			
			if(uxl.isFunction(action)) {
				action(target);
			}
			else if(uxl.isString(action)) {
				if(target.get(0) == document) {
					uxl.setReadOnly(target);
				}
				else {
					if(action == 'hide') {
						target.hide();
					}
					else if(action == 'disable') {
						uxl.setReadOnly(target);
					}
					else {
						target.remove();
					}
				}
			}
		};
	};
	
	/**
	 * Screen Function Binding
	 * @param {String} Function ID or Function Alias
	 * @param {Object} 옵션
	 *                 *. 옵션 프로퍼티
	 *                 - eventTarget : (String || element || jquery array)
	 *                       Service Event 를 발생 시킬 element 의 ID
	 *                       or element 
	 *                       or jquery element 집합(생략가능, default :  함수의 첫번째 매개변수인 Function ID로 설정)
	 *                       
	 *                 - eventType : (String) 
	 *                       Service Event 를 발생 시킬 클라이언트 event 유형. 
	 *                       click or change or select...(생략가능, default : 'click')
	 *                       
	 *                 - message : (String || Object)
	 *                       서비스 완료 후 출력 메세지 or 메세지 리소스 키(리소스 키 사용시 키값앞에 '@' 접두어 필수)
	 *                       or 각 상황별 메세지 프로퍼티 해시를 가진 객체(생략가능, default : 없음)
	 *                       ex) message : '성공적으로 작업을 완료했습니다.'
	 *                       ex) message : '@message.common.complete'
	 *                       ex) message : {
	 *                               confirm : '진행하시겠습니까?',
	 *                               success : '성공적으로 작업을 완료했습니다.',
	 *                               fail : '작업이 실패했습니다..'
	 *                           }
	 *                       ex) message : {
	 *                               confirm : '@message.common.confirm'
	 *                               success : '@message.common.success',
	 *                               fail : '@message.common.fail'
	 *                           }
	 *                           
	 *                 - data : (Object)
	 *                       서비스 호출 시 서버로 전송할 data(생략가능, default : 없음)
	 *                       
	 *                 - formName : (String || Form Element)
	 *                       전송 폼 이름 or 전송 폼 element(생략가능, default : 없음)
	 *                       
	 *                 - validator : (Function)
	 *                       서비스 호출 전 앞단에서 실행될 검증 함수(생략가능, default : 없음)
	 *                       해당 함수가 false 를 반환 할 경우 서비스 호출 취소
	 *                       함수의 첫번째 매개변수로 서버로 전송될 data 객체가 전달된다
	 *                       
	 *                 - success : (Function || String)
	 *                       서비스 정상 완료 후 실행될 콜백 함수 or 이동 할 화면 ID(or URL)(생략가능, default : 없음)
	 *                       함수일 경우 함수의 첫번째 매개변수로 서비스 결과 객체(uxl.Result)가 전달된다
	 *                       
	 *                 - fail : (Function) 
	 *                       서비스 실패 후 실행될 콜백 함수(생략가능, default : 없음)
	 *                       서버 응답 에러 상태에 호출되는 콜백이 아니라 서비스 완료 후 
	 *                       서비스 결과 객체(uxl.Result)의 성공여부가 false 일 경우에 호출된다
	 *                       함수의 첫번째 매개변수로 서비스 결과 객체(uxl.Result)가 전달된다
	 *                       
	 *                 - ignoreConfirm : (Boolean) 
	 *                       서비스 실행전 사용자에게 실행여부를 묻는 confirm 을 실행하지 않는다.
	 *                       
	 *                 - serviceStart : (Function) 
	 *                       서비스 호출 직전에 실행될 함수(생략가능, default : 없음)
	 *                       서비스 실행시에 특정 input 을 enable 시키거나 특정값을 치환하는 등의
	 *                       준비 작업을 해줄 함수 호출
	 *                       
	 *                 - noAuthAction : (Function || String) 
	 *                       권한없을 경우 실행될 처리
	 * @return 없음
	
	uxl.Page.bindServiceEvent = function(functionId, option) {
		// option default setting
		option = $.extend({
			eventTarget: functionId,
			eventType: 'click',
			ignoreConfirm: false,
			serviceStart: $.noop
		}, option || {});
		
		// argument assertion
		if(uxl.isEmpty(functionId)) {
			return uxl.error('Function ID(or Alias) is null ((uxl.Page.bindServiceEvent))');
		}
		if(uxl.isNull(option.eventTarget)) {
			return uxl.error('option.eventTarget is null ((uxl.Page.bindServiceEvent))');
		}
		if(uxl.isNull(option.eventType)) {
			return uxl.error('option.eventType is null ((uxl.Page.bindServiceEvent))');
		}
		
		var screenFunction = uxl.Page.Util.findScreenFunction(functionId);
		// Service Event Function assertion
		if(uxl.isNull(screenFunction)) {
			return uxl.error('Service event binding error; Function [id or alias=' + functionId + '] is undefined; ((uxl.Page.bindServiceEvent))');
		}
		if(screenFunction.functionType == 'ClientEvent') {
			return uxl.error('Service event binding error; Function [id=' + screenFunction.functionId + '] is not Service Event; ((uxl.Page.bindServiceEvent))');
		}
		if(uxl.isEmpty(screenFunction.serviceId)) {
			return uxl.error('Service event binding error; Function [id=' + screenFunction.functionId + '] is not linked to Service; ((uxl.Page.bindServiceEvent))');
		}

		// 권한 관련 제어
		//uxl.Page.syncTargetWithAuth(functionId, option.eventTarget, option.noAuthAction);
		
		
		// 서비스 실행 및 후처리 메세지 설정
		var confirmMessage = '';
		var successMessage = '';
		var failMessage = '';
		if(uxl.isNotNull(option.message)) {
			if(uxl.isString(option.message)) {
				successMessage = option.message;
			}
			else {
				confirmMessage = option.message['confirm'];
				successMessage = option.message['success'];
				failMessage = option.message['fail'];
			}
		}
		if(option.ignoreConfirm === true) {
			confirmMessage = '';
		}
		
		// 서비스 실행 및 후처리 함수 설정
		var validateHandler = uxl.Page.Util.makeServiceValidateHandler(option.validator, confirmMessage);
		var successHandler = uxl.Page.Util.makeServiceSuccessHandler(option.success, option.fail, successMessage, failMessage);
		
		// option.eventTarget 값이 String 일 경우 이벤트가 발생될 element id 로 판단  
		option.eventTarget = uxl.isString(option.eventTarget) ? $('#' + option.eventTarget) : $(option.eventTarget);
		
		// 서비스접근토큰 키가 없을 경우 이벤트 타겟 객체 삭제
		if(uxl.Page.canDoit(functionId) == false && option.removeNoAuthFunction) {
			option.eventTarget.remove();
		}
		
		var token = {};
		token[uxl.CONSTANT.SECURITY.TOKEN] = screenFunction.tokenKey;
		
		option.eventTarget.bind(option.eventType, function(event) {
			if(uxl.isEmpty(option.formName)) {
				uxl.callFunction(screenFunction.serviceId, $.extend(option.data, token), validateHandler, successHandler, false, option.serviceStart);
			}
			else {
				uxl.callSubmitFunction(option.formName, screenFunction.serviceId, $.extend(option.data, token), validateHandler, successHandler, false, option.serviceStart);
			}
		});
		
		return option.eventTarget;
	};
	 */
	
	/**
	 * Screen Function Trigger
	 * @param {String} Function ID or Function Alias
	 * @param {Object} 옵션
	 *                 *. 옵션 프로퍼티
	 *                 - message : (String || Object)
	 *                       서비스 완료 후 출력 메세지 or 메세지 리소스 키(리소스 키 사용시 키값앞에 '@' 접두어 필수)
	 *                       or 각 상황별 메세지 프로퍼티 해시를 가진 객체(생략가능, default : 없음)
	 *                       ex) message : '성공적으로 작업을 완료했습니다.'
	 *                       ex) message : '@message.common.complete'
	 *                       ex) message : {
	 *                               confirm : '진행하시겠습니까?',
	 *                               success : '성공적으로 작업을 완료했습니다.',
	 *                               fail : '작업이 실패했습니다..'
	 *                           }
	 *                       ex) message : {
	 *                               confirm : '@message.common.confirm'
	 *                               success : '@message.common.success',
	 *                               fail : '@message.common.fail'
	 *                           }
	 *                           
	 *                 - data : (Object)
	 *                       서비스 호출 시 서버로 전송할 data(생략가능, default : 없음)
	 *                       
	 *                 - formName : (String || Form Element)
	 *                       전송 폼 이름 or 전송 폼 element(생략가능, default : 없음)
	 *                       
	 *                 - validator : (Function)
	 *                       서비스 호출 전 앞단에서 실행될 검증 함수(생략가능, default : 없음)
	 *                       해당 함수가 false 를 반환 할 경우 서비스 호출 취소
	 *                       함수의 첫번째 매개변수로 서버로 전송될 data 객체가 전달된다
	 *                       
	 *                 - success : (Function || String)
	 *                       서비스 정상 완료 후 실행될 콜백 함수 or 이동 할 화면 ID(or URL)(생략가능, default : 없음)
	 *                       함수일 경우 함수의 첫번째 매개변수로 서비스 결과 객체(uxl.Result)가 전달된다
	 *                       
	 *                 - fail : (Function) 
	 *                       서비스 실패 후 실행될 콜백 함수(생략가능, default : 없음)
	 *                       서버 응답 에러 상태에 호출되는 콜백이 아니라 서비스 완료 후 
	 *                       서비스 결과 객체(uxl.Result)의 성공여부가 false 일 경우에 호출된다
	 *                       함수의 첫번째 매개변수로 서비스 결과 객체(uxl.Result)가 전달된다
	 *                       
	 *                 - ignoreConfirm : (Boolean) 
	 *                       서비스 실행전 사용자에게 실행여부를 묻는 confirm 을 실행하지 않는다. 
	 *                       
	 *                 - serviceStart : (Function) 
	 *                       서비스 호출 직전에 실행될 함수(생략가능, default : 없음)
	 *                       서비스 실행시에 특정 input 을 enable 시키거나 특정값을 치환하는 등의
	 *                       준비 작업을 해줄 함수 호출
	 * @return 없음
	
	uxl.Page.triggerServiceEvent = function(functionAlias, option) {
		// option default setting
		option = $.extend({
			ignoreConfirm: false,
			serviceStart: $.noop
		}, option || {});

		// argument assertion
		if(uxl.isEmpty(functionAlias)) {
			return uxl.error('Function ID(or Alias) is null ((uxl.Page.bindServiceEvent))');
		}
		
		var screenFunction = uxl.Page.Util.findScreenFunction(functionAlias);
		// Service Event Function assertion
		if(uxl.isNull(screenFunction)) {
			return uxl.error('Service event binding error; Function [id or alias=' + functionAlias + '] is not binded to screen; ((uxl.Page.bindServiceEvent))');
		}
		if(screenFunction.functionType == 'ClientEvent') {
			return uxl.error('Service event binding error; Function [id=' + screenFunction.functionId + '] is not Service Event; ((uxl.Page.bindServiceEvent))');
		}
		if(uxl.isEmpty(screenFunction.serviceId)) {
			return uxl.error('Service event binding error; Function [id=' + screenFunction.functionId + '] is not linked to Service; ((uxl.Page.bindServiceEvent))');
		}
		
		// 서비스 실행 및 후처리 메세지 설정
		var confirmMessage = '';
		var successMessage = '';
		var failMessage = '';
		if(uxl.isNotNull(option.message)) {
			if(uxl.isString(option.message)) {
				successMessage = option.message;
			}
			else {
				confirmMessage = option.message['confirm'];
				successMessage = option.message['success'];
				failMessage = option.message['fail'];
			}
		}
		if(option.ignoreConfirm === true) {
			confirmMessage = '';
		}
		
		var validateHandler = uxl.Page.Util.makeServiceValidateHandler(option.validator, confirmMessage);
		var successHandler = uxl.Page.Util.makeServiceSuccessHandler(option.success, option.fail, successMessage, failMessage);

		var token = {};
		token[uxl.CONSTANT.SECURITY.TOKEN] = screenFunction.tokenKey;
		if(uxl.isEmpty(option.formName)) {
			uxl.callFunction(screenFunction.serviceId, $.extend(option.data, token), validateHandler, successHandler, false, option.serviceStart);
		}
		else {
			uxl.callSubmitFunction(option.formName, screenFunction.serviceId, $.extend(option.data, token), validateHandler, successHandler, false, option.serviceStart);
		}
	};
	 */
	
	/**
	 * bindServiceEvent 함수 매개변수에 사용할 기본 Option 객체 생성
	 * @param {String} Function ID or Function Alias
	 * @param {Object} 사전정의된 Option 에 설정을 달리할 Option 
	 *                 - uxl.Page.bindServiceEvent의 Option 설명 참조
	 * @return {Object} uxl.Page.Util.makeServiceOption 함수의 매개변수로 사용될 Option 객체
	
	uxl.Page.makeServiceEventOption = function(functionId, option) {
		// argument assertion
		if(uxl.isEmpty(functionId)) {
			return uxl.error('Function ID is null ((uxl.Page.Util.makeServiceOption))');
		}
		return $.extend(uxl.Page.ServiceEventOptions[functionId] || {}, option || {});
	};
	 */
	/**
	 * Service Event 사전정의 기본 Option 해쉬
	 
	uxl.Page.ServiceEventOptions = {
		REGIST: {
			eventTarget : uxl.CONSTANT.BUTTON.INSERT,
			eventType : 'click',
			message: {
				confirm: '@message.common.insert.confirm',
				success: '@message.common.insert.success',
				fail: '@message.common.insert.fail'
			},
			formName: 'detailForm',
			validator: function(data, targetForm) {
				return uxl.validateBasicInput(targetForm);
			}
		},
		MODIFY: {
			eventTarget : uxl.CONSTANT.BUTTON.UPDATE,
			eventType : 'click',
			message: {
				confirm: '@message.common.update.confirm',
				success: '@message.common.update.success',
				fail: '@message.common.update.fail'
			},
			formName: 'detailForm',
			validator: function(data, targetForm) {
				return uxl.validateBasicInput(targetForm);
			},
			success: function() {
				uxl.reload();
			}
		},
		REMOVE: {
			eventTarget : uxl.CONSTANT.BUTTON.DELETE,
			eventType : 'click',
			message: {
				confirm: '@message.common.delete.confirm',
				success: '@message.common.delete.success',
				fail: '@message.common.delete.fail'
			},
			formName: 'detailForm',
			success: function() {
				$('#' + uxl.CONSTANT.BUTTON.LIST).click();
			}
		},
		REQUEST: {
			eventTarget : uxl.CONSTANT.BUTTON.REQUEST,
			eventType : 'click',
			message: {
				confirm: '@message.common.request.confirm',
				success: '@message.common.request.success',
				fail: '@message.common.request.fail'
			},
			formName: 'detailForm',
			validator: function(data, targetForm) {
				return uxl.validateBasicInput(targetForm);
			},
			success: function() {
				$('#' + uxl.CONSTANT.BUTTON.LIST).click();
			}
		},
		CONFIRM: {
			eventTarget : uxl.CONSTANT.BUTTON.CONFIRM,
			eventType : 'click',
			message: {
				confirm: '@message.common.confirm.confirm',
				success: '@message.common.confirm.success',
				fail: '@message.common.confirm.fail'
			},
			formName: 'detailForm',
			validator: function(data, targetForm) {
				return uxl.validateBasicInput(targetForm);
			},
			success: function() {
				uxl.reload();
				
			}
		},
		COMPLETE: {
			eventTarget : uxl.CONSTANT.BUTTON.COMPLETE,
			eventType : 'click',
			message: {
				confirm: '@message.common.complete.confirm',
				success: '@message.common.complete.success',
				fail: '@message.common.complete.fail'
			},
			formName: 'detailForm',
			validator: function(data, targetForm) {
				return uxl.validateBasicInput(targetForm);
			},
			success: function() {
				uxl.reload();
			}
		},
		CANCEL: {
			eventTarget : uxl.CONSTANT.BUTTON.CANCEL,
			eventType : 'click',
			message: {
				confirm: '@message.common.cancel.confirm',
				success: '@message.common.cancel.success',
				fail: '@message.common.cancel.fail'
			},
			formName: 'detailForm',
			success: function() {
				$('#' + uxl.CONSTANT.BUTTON.LIST).click();
			}
		},
		IMPORT: {
			eventTarget : uxl.CONSTANT.BUTTON.IMPORT,
			eventType : 'click',
			message: {
				confirm: '@message.common.import.confirm',
				success: '',
				fail: '@message.common.import.fail'
			},
			formName: 'detailForm'
		},
		EXPORT: {
			eventTarget : uxl.CONSTANT.BUTTON.EXPORT,
			eventType : 'click',
			success: function(result) {
				var filelink = result.getResultKey();
				
				if ($('#exportListViewer').size() == 0) {
					$('<div id="exportListViewer"></div>').appendTo('body');
				}
				$('#exportListViewer').dialog({
					width: 460,
					title : 'Download Result',
					open: function(event, ui) {
						var tag = '';
						if(filelink == null) {
							tag = tag + '<span>다운로드할 데이터가 존재하지 않습니다.</span>';
						}
						else {
							tag = tag + '<span>아래의 다운로드 link를 클릭하시면 파일을 다운로드 받을 수 있습니다.</span>';
							tag = tag + '<br/><br/><ul>';
							for(var i=0; i<filelink.length; i++) {
								var url = uxl.getContextURL('/file/view.do');
								url = uxl.addQueryToUrl(url, 'filePath', filelink[i]);
								tag = tag + '<li ><a href="' + url + '" target="_self" style="color:#B54444"> 다운로드 파일 '+ (i + 1) +' </a></li>';
							}
							tag = tag + '</ul>';
						}
						
						$(this).html(tag);
					},
					close: function(event, ui) {
						$(this).remove();
					}
				});
			},
			formName: 'detailForm'
		}
	};
*/
	/**
	 * Page Util
	 */
	uxl.Page.Util = {
			
		/**
		 * Screen Function 객체 가져오기
		 * @param {String} Function ID or Function Alias
		 * @return {Object} Screen Function Object
		 */
		findScreenFunction: function(functionId) {
			// argument assertion
			if(uxl.isEmpty(functionId)) {
				return uxl.error('Function ID is null ((uxl.Page.Util.findScreenFunction))');
			}
			
			var screenFunction = null;
			$.each(uxl.Page.screenFunctions, function(index, item) {
				if(uxl.isFunctionId(functionId)) {
					if(item.functionId == functionId) {
						screenFunction = item;
						return false;
					}
				}
				else {
					if(item.alias == functionId) {
						screenFunction = item;
						return false;
					}
				}
			});
			
			return screenFunction;
		},
		
		/**
		 * 서비스 호출에 앞서 호출될 Validator 함수 생성
		 * @param {Function} 서비스 호출 전 앞단에서 실행될 검증 함수
		 *                   해당 함수가 false 를 반환 할 경우 서비스 호출 취소
		 *                   함수의 첫번째 매개변수로 서버로 전송될 data 객체가 전달된다
		 * @param {String} confirm 메세지 or 메세지 리소스 키(리소스 키 사용시 키값앞에 '@' 접두어 필수)
		 * @return {Function} 서비스 호출 검증 함수
		 */
		makeServiceValidateHandler: function(validator, confirmMessage) {
			return function (data, targetForm) {
				var check = true;
				if(uxl.isFunction(validator)) {
					try {
						check = validator(data, targetForm);
					}
					catch (e) {
						uxl.error(e.message, e);
						return false;
					}
				}
				if(check == true && uxl.isNotEmpty(confirmMessage)) {
					confirmMessage = uxl.isMessageKey(confirmMessage) ? uxl.getMessage(confirmMessage) : confirmMessage;
					return confirm(confirmMessage);
				}
				return check;
			};
		},
		
		/**
		 * Service 호출 완료 후 실행될 콜백 함수 생성
		 * @param {Function || String} 서비스 정상 완료 후 실행될 콜백 함수 or 이동 할 화면 ID(or URL)
		 *                             함수일 경우 함수의 첫번째 매개변수로 서비스 결과 객체(url.Result)가 전달된다
		 * @param {Function} 서비스 실패 후 실행될 콜백 함수
		 *                   응답이 에러 상황에 호출되는 콜백이 아니라 서비스 완료 후
		 *                   서비스 결과 객체(url.Result)의 성공여부가 false 일 경우에 호출된다
		 *                   함수의 첫번째 매개변수로 서비스 결과 객체(url.Result)가 전달된다
		 * @param {String} 성공시 메세지 or 성공시 메세지 리소스 키(리소스 키 사용시 키값앞에 '@' 접두어 필수)
		 * @param {String} 실패시 메세지 or 실패시 메세지 리소스 키(리소스 키 사용시 키값앞에 '@' 접두어 필수)
		 * @return {Function} Service 호출 완료 콜백 함수
		 */
		makeServiceSuccessHandler: function(success, fail, successMessage, failMessage) {
			return function(data) {
				var result = new uxl.Result(data);
				var resultMessage = result.getMessage();
				var completed = $.noop;
				var title = uxl.getMessage('label.common.notice');
				if(result.isSuccess()) {
					completed = function() {
						if(uxl.isNotNull(success)) {
							if(uxl.isString(success)) {
								if(uxl.isScreenId(success)) {
									success = uxl.getScreenURL(success);
								}
								success = uxl.replaceValues(success, result.getResultKey());
								uxl.moveLocation(uxl.getContextURL(success));
							}
							else if(uxl.isFunction(success)){
									uxl.removeLodingDiv();
									success(result);
							}
						}
					};					
					resultMessage = uxl.isEmpty(resultMessage) ? successMessage : resultMessage;
				}
				else {
					completed = function() {
						if(uxl.isNotNull(fail) && uxl.isFunction(fail)){
							fail(result);
						}else{
							alert(uxl.getMessage('message.error.service.common'));
						}
					};
					var errorType = result.getErrorType();
					if(uxl.isNotEmpty(errorType)) {
						title = uxl.getMessage('label.common.warning');
						if(errorType == 'com.ubone.framework.security.acl.AccessDeniedException') {
							resultMessage = uxl.getMessage('message.error.service.noauth');
						}
						else if(errorType == 'com.ubone.framework.engine.service.ServiceException') {
							if(uxl.CONSTANT.SERVER_MODE == 'real') {
								resultMessage = uxl.getMessage('message.error.service.common', result.getServiceId(), result.getServiceErrorId());
							}
							else {
								resultMessage = uxl.getMessage('message.error.service.common.detail', resultMessage, result.getServiceId(), result.getServiceErrorId());
							}
						}
						else {
							if(uxl.CONSTANT.SERVER_MODE == 'real') {
								resultMessage = uxl.getMessage('message.error.service.common', result.getServiceId(), result.getServiceErrorId());
							}
							else {
								resultMessage = uxl.getMessage('message.error.service.common.detail', resultMessage, result.getServiceId(), result.getServiceErrorId());
							}
						}
					}
					else {
						resultMessage = uxl.isEmpty(resultMessage) ? failMessage : resultMessage;
					}
				}
				
				uxl.removeLoadingDiv(); 
				if(uxl.isEmpty(resultMessage)) {
					completed();
				}
				else {
					if(window.top && window.top.uxl) {
						window.top.uxl.showMessage("" + resultMessage, completed, title);
					}
					else {
						uxl.showMessage("" + resultMessage, completed, title);
					}
					
				}
			};
		}
	};
	
	/**
	 * Ajax fucntion 호출
	 * @param {String} ajax function call URL
	 * @param {Object} 서비스 호출 시 서버로 전송할 data
	 * @param {Function} 서비스 호출 전 앞단에서 실행될 검증 함수
	 *                   해당 함수가 false 를 반환 할 경우 서비스 호출 취소
	 *                   함수의 첫번째 매개변수로 서버로 전송될 data 객체가 전달된다
	 * @param {Function} 서비스 호출 완료 후 실행될 콜백 함수
	 *                   함수의 첫번째 매개변수로 서비스 결과 객체(url.Result)가 전달된다
	 * @param {boolean} 비동기여부. true 일 경우 비동기 호출(생략가능, default : false)
	 * @return {boolean} 서비스 호출 실행 여부
	 * @return {boolean} 서비스 실행 준비 함수
	 */
	uxl.callFunction = function(url, option) {
		// assertion
		if(uxl.isEmpty(url)) {
			return uxl.error('URL is null. ((uxl.callFunction))');
		}
		
		//서비스 실행 및 후처리 메세지 설정
		var confirmMessage = '';
		var successMessage = '';
		var failMessage = '';
		if(uxl.isNotNull(option.message)) {
			if(uxl.isString(option.message)) {
				successMessage = option.message;
			}
			else {
				confirmMessage = option.message['confirm'];
				successMessage = option.message['success'];
				failMessage = option.message['fail'];
			}
		}
		if(option.ignoreConfirm === true) {
			confirmMessage = '';
		}
		
		// 서비스 실행 및 후처리 함수 설정
		var validateHandler = uxl.Page.Util.makeServiceValidateHandler(option.validator, confirmMessage);
		var successHandler = uxl.Page.Util.makeServiceSuccessHandler(option.success, option.fail, successMessage, failMessage);
		
		validateHandler = validateHandler || function() {
			return true;
		};

		if(validateHandler(option.data) == false) {
			return false;
		}
		
		// 1.2.0 : 멀티View 보완 - window_name 추가
		option.data = $.extend({_window_name:window.name}, option.data || {});
		
		// 1.2.2. 암호화 처리
		if(uxl.isNotNull(option.cryptoParams)){
			var keys = $.jCryption.getKeys($.jCryption.defaultOptions.getKeysURL);
			
			// 대상 컬럼 암호화 처리
			for(var i=0; i<option.cryptoParams.length; i++){
				var paramName = option.cryptoParams[i];
				if(uxl.isNotNull(option.data) && uxl.isNotNull(option.data[paramName])){
					$.jCryption.encrypt(encodeURI(option.data[paramName]), keys, function(encrypted) {
						option.data[paramName] = encrypted;
					});
				}
			}
		}
		
		$.ajax({
			url:url,
			type: 'POST',
			data: option.data,
			dataType: 'json',
			success: successHandler || $.noop,
			async: uxl.isUndefined(option.async) ? true : option.async,
			beforeSend : function(xhr, settings){
				try{
					if(uxl.isUndefined(option.loading) ? true : option.loading){
						if(!$(document.body).has('#divLoding').length){
							uxl.showLoadingDiv();
						}  
					}
				}catch(e){}
			}
		});
		
		return true;
	};

	/**
	 * Ajax Submit 서비스 호출
	 * @param {String || Form Element} 전송 폼 이름 or 전송 폼 객체
	 * @param {String} ajax service call URL or Service ID
	 * @param {Object} 서비스 호출 시 서버로 전송할 data
	 * @param {Function} 서비스 호출 전 앞단에서 실행될 검증 함수
	 *                   해당 함수가 false 를 반환 할 경우 서비스 호출 취소
	 *                   함수의 첫번째 매개변수로 서버로 전송될 data 객체가 전달된다
	 * @param {Function} 서비스 호출 완료 후 실행될 콜백 함수
	 *                   함수의 첫번째 매개변수로 서비스 결과 객체(url.Result)가 전달된다
	 * @param {boolean} 비동기여부. true 일 경우 비동기 호출(생략가능, default : false)
	 * @return {boolean} 서비스 호출 실행 여부
	 * @return {boolean} 서비스 실행 준비 함수
	 */
	uxl.callSubmitFunction = function(targetForm, url, option) {

		//입력값 확인 
		if(uxl.isNull(targetForm) || uxl.isEmpty(targetForm)) {
			return uxl.debug('target form name(or target form element) is null. ((uxl.callSubmitFunction))');
		}
		
		if(uxl.isString(targetForm)) {
			targetForm = document.forms[targetForm];
		}
		
		if(targetForm == null) {
			return uxl.debug('can not find form[name=' + targetForm.name + '] in document. ((uxl.callSubmitFunction))');
		}
		
		if(uxl.isEmpty(url)) {
			return uxl.error('URL is null. ((uxl.callFunction))');
		}
		
		//서비스 실행 및 후처리 메세지 설정
		var confirmMessage = '';
		var successMessage = '';
		var failMessage = '';
		if(uxl.isNotNull(option.message)) {
			if(uxl.isString(option.message)) {
				successMessage = option.message;
			}
			else {
				confirmMessage = option.message['confirm'];
				successMessage = option.message['success'];
				failMessage = option.message['fail'];
			}
		}
		if(option.ignoreConfirm === true) {
			confirmMessage = '';
		}
		
		// 서비스 실행 및 후처리 함수 설정
		var validateHandler = uxl.Page.Util.makeServiceValidateHandler(option.validator, confirmMessage);
		var successHandler = uxl.Page.Util.makeServiceSuccessHandler(option.success, option.fail, successMessage, failMessage);
		
		validateHandler = validateHandler || function() {
			return true;
		};

		if(validateHandler(option.data, targetForm) == false) {
			return false;
		}

		// 1.2.0 : 멀티View 보완 - window_name 추가
		option.data = $.extend({_window_name:window.name}, option.data || {});
		
		
		var options = {
			url: url,
			type: 'POST',
			data: option.data,
			dataType: 'json',
			success: successHandler || $.noop,
			async: uxl.isUndefined(option.async) ? true : option.async,
			beforeSubmit : function(params, $this, options){
				
				// 1.2.2. 암호화 처리
				if(uxl.isNotNull(option.cryptoParams)){
					var keys = $.jCryption.getKeys($.jCryption.defaultOptions.getKeysURL);
				
					// 암호화 처리 대상 컬럼이 존재
					for(var j=0; j<option.cryptoParams.length; j++){
						for(var i=0; i<params.length; i++){
							if(params[i].name == option.cryptoParams[j]){
							   $.jCryption.encrypt(encodeURI(params[i].value), keys, function(encrypted) {
								   params[i].value = encrypted;
							   });
							}
						}
					}
				}
			},
			beforeSend : function(xhr, settings){
				  try{
					  uxl.showLoadingDiv();
				  }catch(e){}
			}
		};
					
		$(targetForm).ajaxSubmit(options);
	};

	/**
	 * deprecate Next ver 2.0.0
	 */
	uxl.removeLodingDiv  = function(){ uxl.removeLoadingDiv(); };
	uxl.removeLoadingDiv = function(){
		$('.loading-wrap').remove();
	};

	/**
	 * deprecate Next ver 2.0.0
	 */
	uxl.showLodingDiv  = function(){ uxl.showLoadingDiv(); };
	uxl.showLoadingDiv = function(){
		uxl.removeLoadingDiv();
		var img = $('<img>').attr('src', uxl.getContextURL('/page/standard/images/common/loading_spot.gif'));
		$("body:last").append($("<div>",{
			"class" : "loading-wrap"
			,"style" : "display: inline-block;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -100%);" 
		}).append(img))
	};
	
	/**
	 * Ajax 조회 서비스 호출
	 * @param {String} ajax service call URL or Service ID
	 * @param {Object} 서비스 호출 시 서버로 전송할 data
	 * @param {Function} 서비스 호출 성공시 실행될 콜백 함수
	 *                   함수의 첫번째 매개변수로 서비스 결과 객체(url.Result)가 전달된다
	 * @param {boolean} 비동기여부. true 일 경우 비동기 호출(생략가능, default : true)
	 * @return 없음
	 */
	uxl.ajaxQuery = function(url, parameter, success, async) {
		if(uxl.isEmpty(url)) {
			return uxl.debug('URL(or Service ID) is null. ((uxl.ajaxQuery))');
		}

		success = success || $.noop;
		var option = {
			url: uxl.isServiceId(url) ? uxl.getServiceURL(url) : url,
			type: 'POST',
			data: parameter,
			dataType: 'json',
			success: function(data) {
				var result = new uxl.Result(data);
				try {
					success(result);
				}
				catch (e) {
					uxl.error(e.message, e);
				}
			},
			async: uxl.isUndefined(async) ? true : async
		};
		$.ajax(option);
	};
	
	
	/**
	 * Ajax 화면 load - Deprecate Function - 2017-04-19
	 * @param {String || Element} laoding target element id or element
	 * @param {String} load contents URL or Screen ID
	 * @param {Object} 호출 시 서버로 전송할 data
	 * @param {Function} 로딩 완료 실행 될 콜백 함수
	 * @return 없음
	 */
	uxl.load = function(target, url, data, completeHandler) {
		// assertion
		if(uxl.isNull(target) || uxl.isEmpty(target)) {
			return uxl.debug('load target id(or target element) is null. ((uxl.load))');
		}
		if(uxl.isEmpty(url)) {
			return uxl.debug('URL(or Screen ID) is null. ((uxl.load))');
		}
		
		var img = $('<img>').attr('src', uxl.getContextURL('/page/standard/images/common/loading_spot.gif'));
		var loading = $('<div></div>').css({
			'width' : '100%',
			'text-align' : 'center',
			'margin' : '12px'
		}).append(img);
		
		$(uxl.isString(target) ? '#' + target : target)
		.html(loading)
		.load(uxl.isScreenId(url) ? uxl.getScreenURL(url) : url, 
				data || {}, 
				completeHandler || $.noop);
	};
	
	/**
	 * 동적 로드 페이지 함수
	 * @param {String || Element} loading target element id or element
	 * @param {String} load contents URL
	 * @param options
	 *   - callback : call-back function
	 *   - loadingbar : true-show
	 * @return 없음
	 */
	uxl.loadPage = function(target, url, options) {
		var $target = $(uxl.isString(target)?'#'+target:target);
		
		options = $.extend({
			callback : function(){},
			loadingbar : true
		}, options ||{});
		
		if(uxl.isNull(target) || uxl.isEmpty(target) || $target.size() == 0){
			return uxl.debug("load target id(or target element) is null. ((uxl.loadPage))");
		}
		
		if(uxl.isEmpty(url)){
			return uxl.debug("URL is null. (uxl.loadPage)");
		}
		
		if(options.loadingbar){
			uxl.showLoadingDiv();
		}
		
		$target.load(url, function(response, status, xhr){
			// 공통 처리 UI
			uxl.initCommonUI($target);
			
			// 로딩바 삭제
			uxl.removeLodingDiv();
			
			if(uxl.isFunction(options.callback)){
				options.callback.call(this. $target);
			}
		});
	};
	
	
	// jQuery ajax 기본 옵션 설정
	$.ajaxSetup({
		traditional: true
		, data : {_window_name:window.name}
	});
	
	$(document).ajaxStart(function() {
	});
	
	$(document).ajaxStop(function() {
	});
	
	$(document).ajaxSend(function(e, xhr, settings) {
		if(uxl.isServiceRequestPath(settings.url) && settings.async == false) {
			//uxl.showStatusBar();
		}
	});
	
	$(document).ajaxError(function(e, xhr, settings, error) {
		
		uxl.removeLodingDiv(); 

		if(error.code == 19){
			uxl.showMessage("일시적인 Network 오류가 발생하였습니다. 잠시후 다시 이용해 주십시오.");
		}
		
		if(settings.dataType.toLowerCase() == 'json'){
			if(xhr.status == 401) {
				
				// 로그아웃시 메세지 처리
				var logoutMessage = $.cookie('logout.message');
				$.removeCookie('logout.message', {path:'/'});
				
				if(uxl.isNull(logoutMessage)){
					logoutMessage = uxl.getMessage('message.error.http.401');
				}
				
				uxl.showMessage(logoutMessage);
				if(opener){
					if(opener.opener){
						uxl.moveLocation('/logout.ub', opener.opener.top.document);
						window.close();
					}else{
						uxl.moveLocation('/logout.ub', opener.top.document);
						window.close();
					}
				}else{
					uxl.moveLocation('/logout.ub', this);
				}
			}
			else if(xhr.status == 403) {
				uxl.showMessage('@message.error.http.403', null, uxl.getMessage('label.common.warning'));
			}
			else if(xhr.status == 404) {
				uxl.showMessage('@message.error.http.404', null, uxl.getMessage('label.common.warning'));
			}
			else if(xhr.status == 500) {
				uxl.showMessage('@message.error.http.500', null, uxl.getMessage('label.common.warning'));
			}
		}
	});
	
	$(document).ajaxComplete(function(e, xhr, settings) {
		if(uxl.isServiceRequestPath(settings.url) && settings.async === false) {
			//uxl.hideStatusBar();
		}
	});
})(jQuery, uxl);