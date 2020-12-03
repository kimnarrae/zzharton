(function($, uxl) {
	
	/**
	 * @class jqgrid version 2.0.0 module<br/>
	 * @author 강영운
	 *  3.1.0 : 2017-11-28
	 *  		1) uxl.grid.loadData 함수추가
	 *             - 대량의 데이터를 추가시 기존 uxl.grid.appendData는 한건씩 처리하는 로직이므로 로딩에 시간이 오래걸리는 문제점을 해결하기 위하여
	 *               loadData함수를 추가함.
	 *  3.0.0 : 2017-10-19
	 *  		1) rowNum 건수 선택 기능 - 버그 수정
	 *  		2) 페이징 처리시 PageSize 값은 Result에서 PageSize 값을 이용하도록 처리함.
	 *  		3) autoheight : false - 속성 추가
	 *           , bottomHeight : 80 - 속성추가
	 *             --> 바닥을 고정하여 그리드의 높이를 Window의 높이에 맞게 높이를 조정함.
	 *  2.2.0 : 2017-07-07
	 *          1) 검색이력 조건 복구 명령어 추가 - 서비스 호출시에도 검색이력 복구 처리가 되도록 수정
	 *             ub-framework-aspect-1.6.4.jar 이상 버젼에서 지원됨
	 *  2.1.0 : 2017-04-14
	 *          1) DivTab 컨트롤 추가로 한화면에 여러개의 목록이 될경우 오류가 발생됨.
	 *             현재 컨트롤 기줄의 처리가 가능하도록 수정처리
	 *  2.0.0 : 2016-06-10
	 *          1) Grid Dual-Paging 기능 추가 (그리드를 기준으로 Top/Buttom에 추가)
	 *             ubPlugins {
	 *             		paging : {top : true, buttom : true}   -->  default : {top : false, buttom: true} 
	 *             }
	 *          2) rowNum 건수 선택 기능 (콤보박스)
	 *  
	 *  1.4.0 : 1) EditableCell ClassName 추가 (시각적인 효과 표시를 위함)
	 *  
	 *  1.3.0 : 1) 이전검색조건 셋팅시 첫페이지로 이동하는 버그 (IE8)
	 *          2) uxl.grid.init 함수의 input:hidden 컨트롤 초기화 버그 수정(IE8)
	 *  1.2.0 : APMD에 있는 PageSize와 그리드옵션의 rowNum 값 Sync 처리 추가
	 *          초기 options에서 설정한 값은 데이터 조회후 무시됨.
	 *  1.1.0 : SortColumn sortable:false에는 정렬이 되지 않게 수정
	 *          ubPlugins 기능 도입 (redmine 정리)
	 *           - multiselect.disableByCondition - 조건에따른 체크박스 비활성화 기능 
	 *           - multiselect.onlyOneCheck - 체크박스 하나만 선택가능하도록 하는 기능
	 *           - footerSum - 그리드 목록 데이터의 합계를 풋터에 나타내는 기능 (2015-06-19)
	 *          optionsList에 option을 추가하는 부분을 grid excute 하기 전으로 수정 (2015-05-18)
	 *           - excute중 optionsList를 참조하는 부분이 존재하여, 후에 option을 추가시 undefined error 발생
	 *        
	 *  1.0.0 : 초기 기능 구현
	 */
	
	var optionsList = {};
	
	/**
	 * @param {element} jquery's selector or table's id 
	 * @param {options} custom options
	 * @param {pagerFlag} check whether making navigation is true or not
	 */
	uxl.grid= function(element, options) {
		$this = this;
		
		// making jqgrid object
		$('.ub-control.temp').remove();
		
		$jqGrid = uxl.isString(element)? $('#'+element) : element;

		// default options
		options = $.extend({
			id : $jqGrid.attr('id'),
			optionsOrg:options,
			datatype:"local",
			viewrecords:true,
			sortable:true,
			rowNum:"10",
			scroll:true,
			loadonce:true,
			height:"261px",
			multiselect : false,
			footerrow : false,
			cellEdit: false,
			rowList: [10, 20, 50],
			autoheight:false,
			bottomHeight:80,
			ubPlugins:{}
		}, options || {});

		// 정의된 ubPlugin init
		uxl.grid.plugin.footerSum.init(options);
		uxl.grid.plugin.multiselect.onlyOneCheck.init(options);
		uxl.grid.plugin.multiselect.disableByCondition.init(options);
		uxl.grid.plugin.paging.init(options);

		// event binding
		options = $.extend(options, {
			onCellSelect:function(rowid, iCol, cellContent, e){
				var result = true;
				//disableByCondition 플러그인 조회 및 적용
				if(uxl.grid.plugin.multiselect.disableByCondition.checkPlugin.call(this)){
					result = uxl.grid.plugin.multiselect.disableByCondition.onCellSelect.call(this, rowid, iCol, cellContent, e);
				}
				
				//원본 option event 호출
				if(result && uxl.isNotNull(options.optionsOrg.onCellSelect)){
					options.optionsOrg.onCellSelect.call(this, rowid, iCol, cellContent, e);
				}
			},
			afterInsertRow : function(rowid, rowdata, rowelem){

				//editable 플러그인 조회 및 적용
				if(uxl.grid.plugin.cell.editable.checkPlugin.call(this)){
					uxl.grid.plugin.cell.editable.afterInsertRow.call(this, rowid, rowdata, rowelem);
				}
				
				//disableByCondition 플러그인 조회 및 적용
				if(uxl.grid.plugin.multiselect.disableByCondition.checkPlugin.call(this)){
					uxl.grid.plugin.multiselect.disableByCondition.afterInsertRow.call(this, rowid, rowdata, rowelem);
				}
				
				//원본 option event 호출
				if(uxl.isNotNull(options.optionsOrg.afterInsertRow)){
					options.optionsOrg.afterInsertRow.call(this, rowid, rowdata, rowelem);
				}
			},
			onSelectAll : function(aRowids, status){
				//disableByCondition 플러그인 조회 및 적용
				if(uxl.grid.plugin.multiselect.disableByCondition.checkPlugin.call(this)){
					uxl.grid.plugin.multiselect.disableByCondition.onSelectAll.call(this, aRowids, status);
				}
				
				//onlyOneCheck 플로그인 조회 및 적용
				if(uxl.grid.plugin.multiselect.onlyOneCheck.checkPlugin.call(this)){
					uxl.grid.plugin.multiselect.onlyOneCheck.onSelectAll.call(this, aRowids, status);
				}
				
				//원본 option event 호출
				if(uxl.isNotNull(options.optionsOrg.onSelectAll)){
					options.optionsOrg.onSelectAll.call(this, aRowids, status);
				}
			},
			onSelectRow:function(rowid, status, e){
				//onlyOneCheck 플로그인 조회 및 적용
				if(uxl.grid.plugin.multiselect.onlyOneCheck.checkPlugin.call(this)){
					uxl.grid.plugin.multiselect.onlyOneCheck.onSelectRow.call(this, rowid, status, e);
				}
				
				//원본 option event 호출
				if(uxl.isNotNull(options.optionsOrg.onSelectRow)){
					options.optionsOrg.onSelectRow.call(this, rowid, status, e);
				}
			},
			onSortCol:function(index,iCol,sortorder){
				uxl.grid.sortColumn(options.id, index, iCol, sortorder);
			},
			gridComplete:function(){
				//footerSum 플러그인 조회 및 적용
				if(uxl.grid.plugin.footerSum.checkPlugin.call(this)){
					uxl.grid.plugin.footerSum.gridComplete.call(this);
				}
				
				//원본 option event 호출
				if(uxl.isNotNull(options.optionsOrg.gridComplete)){
					options.optionsOrg.gridComplete.call(this);
				}
				
				/**
				 * 2017-11-28 : 대용량 로드시 캡션태그를 추가하면 데이터 로딩이 되지 않음
				 * 대용량 처리를 위하여 웹접근성 처리는 소스에서 제거 처리함.
				 */
/*				
				// 웹접근성 관련 처리
				$('.ui-jqgrid-htable th.ui-th-column').attr('scope', 'row'); 	// jqgrid는 th.scope을 row로 설정
				$('.ui-jqgrid-htable').each(function(index){
					// Caption이 없을 경우에 생성함.
					if($('caption', $(this)).size() == 0){
						$(this).prepend('<caption>'+_SCREEN_NAME+'-Header List-'+index+'</caption>');
					}
					$(this).attr('summary', _SCREEN_NAME+'-Header List Summary-'+index);
				});
				$('.ui-jqgrid-btable').each(function(index){
					// Caption이 없을 경우에 생성함.
					if($('caption', $(this)).size() == 0){
						var $header = $('thead', $('.ui-jqgrid-htable').get(index)).clone().hide();
						$(this).prepend($header);
						$(this).prepend('<caption>'+_SCREEN_NAME+'-Body List-'+index+'</caption>');
					}
					
					$(this).attr('summary', _SCREEN_NAME+'-Body List Summary-'+index);
				});
*/
			}
		});

		
		// 그리드가 완료되기 전에 optionsList를 참조하는 부분이 생길 경우가 있으므로 그리드 생성 전으로 위치 변경
		optionsList[options.id] = options;
		
		// excuting jqgrid!
		$jqGrid.jqGrid(options);
		
		// 그리드 파리미터 복원 처리
		if(uxl.isNotNull(uxl.pageSize) && uxl.isNotNull(uxl.pageNumber)){
			// 검색이력 조건 복원시 - 목록화면의 chainCode를 사용할 경우 파라미터값이 유지되지 않는 문제가 있어, 서버에서 복원처리하는 명령을 사용함.
			var pager = $('.ub-control.pagging[for="'+options.id+'"]');
			var formName  = pager.attr('formId');
			var searchForm = $('#'+formName);
			var $command = $('<input type="hidden" name="searchRecoveryCommand" value="recovery">');
			$(searchForm).append($command);

			uxl.grid.callFunction(options.id, uxl.pageNumber);
			
			$command.remove();
		}
		
		
		// 높이 Window 사이즈에 따라 조정 / 크기는 화면에 맞게 조정
		if(options.autoheight){
			$(window).resize(function(){
				var top    = $('.ui-jqgrid-bdiv').offset().top;
				var height = $(window).height() - top - options.bottomHeight;
				$('.ui-jqgrid-bdiv').height(height);
			}).resize();
		}
		
		$(window).resize(function(){
			var $jqGridPanel = $jqGrid.parents().find('.ui-jqgrid.ui-widget');
			$jqGridPanel.width('auto');
			
			$('.ui-jqgrid-view', $jqGridPanel).width('auto');
			$('.ui-jqgrid-hdiv', $jqGridPanel).width('auto');
			$('.ui-jqgrid-bdiv', $jqGridPanel).width('auto');
			$jqGrid.setGridWidth('auto', true);

	    }).trigger('resize');
	};
	
	uxl.grid.init = function(grid){
		// making jqgrid object
		$jqGrid = uxl.isString(grid)? $('#'+grid) : grid;
		var $form = $('#'+$(".ub-control.pagging[for='"+$jqGrid.attr('id')+"']").attr('formId'));
		$('#'+_KEY_PAGE_NUMBER , $form).val(''); 
		$('#'+_KEY_PAGE_BLOCK , $form).val('');
		$('#'+_KEY_PAGE_ORDER_COLUMN , $form).val('');
		$('#'+_KEY_PAGE_ORDER_ASC , $form).val('');
	};
	
	uxl.grid.getParam = function(grid){
		// making jqgrid object
		$jqGrid = uxl.isString(grid)? $('#'+grid) : grid;
		
		var option = optionsList[$jqGrid.attr('id')];
		if(uxl.isNull(option)){
			alert('uxl.grid.getParam :: 파라미터에 해당하는 그리드를 찾을 수 없습니다.');
			return false;
		}

		var colModel = option.colModel;
		var param = new Object();
		
		var columnNames = new Array();
		var codeCategories = new Array();
		
		for(var i=0; i<colModel.length; i++){
			var model = colModel[i];
			if(uxl.isNotEmpty(model.codeCategory)){
				columnNames[i] = model.name;
				codeCategories[i] = uxl.isNotEmpty(model.codeCategory)?model.codeCategory:"";
				//param['_GRID_COLUMN_NAME']   = model.name;
				//param['_GRID_CODE_CATEGORY'] = uxl.isNotEmpty(model.codeCategory)?model.codeCategory:"";
			}
		}
		
		param['_GRID_COLUMN_NAME']   = columnNames;
		param['_GRID_CODE_CATEGORY'] = codeCategories;
		
		
		return param;
	};
	
	uxl.grid.getJqGrid = function(grid){
		$jqGrid = uxl.isString(grid)? $('#'+grid) : grid;
	};
	
	uxl.grid.clearGridData = function(grid) {
		$jqGrid = uxl.isString(grid)? $('#'+grid) : grid;
		$jqGrid.jqGrid('clearGridData');
	};

	uxl.grid.appendData = function(grid , result , clearFlag) {

		// making jqgrid object
		$jqGrid = uxl.isString(grid)? $('#'+grid) : grid;
		
		if(true == clearFlag) {
			$jqGrid.jqGrid('clearGridData');
		}
		
		if(uxl.isNotNull(result.getDataList(0))){
			var dataSet = result.getDataList(0).rows;
			var rowCount = result.getDataList(0).rowCount;
			
			var gridRowCount = $jqGrid.getGridParam("records");
			
			var i=0;
			for( i ; i < rowCount ;  dataSet){
				$jqGrid.jqGrid('addRowData',i+gridRowCount,dataSet[i]);
				
				if(dataSet[i]['CHECKED'] == 'Y'){
					$jqGrid.jqGrid('setSelection',i+gridRowCount,false);
				}
				i++;
			}
			uxl.grid.initPaging($jqGrid, result);
		}
	};

	/**
	 * 대량의 건을 빠르게 로딩할 경우 처리하는 함수
	 * - 체크드 기능 처리하지 않는다. 로딩속도에 저해됨.
	 * since 3.1.0
	 */
	uxl.grid.loadData = function(grid , result , clearFlag) {

		// making jqgrid object
		$jqGrid = uxl.isString(grid)? $('#'+grid) : grid;
		
		if(true == clearFlag) {
			$jqGrid.jqGrid('clearGridData');
		}
		
		if(uxl.isNotNull(result.getDataList(0))){
			var dataSet = result.getDataList(0).rows;

			// 대량의 데이터를 한번에 처리하는 기능
			$jqGrid.jqGrid('setGridParam', {datatype:'local', rowNum:'50', data:dataSet}).trigger('reloadGrid');
			
//			uxl.grid.initPaging($jqGrid, result);
		}
	};	

	uxl.grid.rowCount = function(element) {
		// making jqgrid object
		$jqGrid = uxl.isString(element)? $('#'+element) : element;
		
		return $jqGrid.getGridParam("records");
	};
	
    /**
	 *  jqGrid Paging Rendering
	 */
	uxl.grid.initPaging = function($jqGrid, result){
		
		var totalCount = result.getServiceMessage().totalCount;  //총 건수
		var pageNum    = result.getServiceMessage().pageNum;     //현재 페이지
		var pageSize   = result.getServiceMessage().pageSize;

		$jqGrid.jqGrid('setGridParam', {rowNum:pageSize});
		
		// 한 블럭의 페이지 수
	    var pageCntPerBlock = 10;
	    // 그리드 데이터 전체의 페이지 수
	    var totalPage = Math.ceil(totalCount/pageSize);//113/10 11.3 totalPage 12
	    // 전체 페이지 수를 한화면에 보여줄 페이지로 나눈다.
	    var totalPageList = Math.ceil(totalPage/pageCntPerBlock); // 12/10 = 1.2  2
	    // 페이지 리스트가 몇번째 리스트인지
	    var pageList=Math.ceil(pageNum/pageCntPerBlock);  // 1 1 2 1 3 1 100 10 101 

	    // 페이지 리스트가 1보다 작으면 1로 초기화
	    if(pageList<1) pageList=1;
	    // 페이지 리스트가 총 페이지 리스트보다 커지면 총 페이지 리스트로 설정
	    if(pageList>totalPageList) pageList = totalPageList;
	    // 시작 페이지
	    var startPageList=((pageList-1)*pageCntPerBlock)+1;
	    // 끝 페이지
	    var endPageList=startPageList+pageCntPerBlock-1;
	   
	    // 시작 페이지와 끝페이지가 1보다 작으면 1로 설정
	    // 끝 페이지가 마지막 페이지보다 클 경우 마지막 페이지값으로 설정
	    if(startPageList<1) startPageList=1;
	    if(endPageList>totalPage) endPageList=totalPage;
	    if(endPageList<1) endPageList=1;
	   
	    // 페이징 DIV에 넣어줄 태그 생성변수
	    var pageInner="";
	   
	    // 페이지 리스트가 1이나 데이터가 없을 경우 (링크 빼고 흐린 이미지로 변경)
	    if(pageList<2){
	    }
	    // 이전 페이지 리스트가 있을 경우 (링크넣고 뚜렷한 이미지로 변경)
	    if(pageList>1){
	       
	        pageInner+='<a title="First" class="ub-control button imgBtn img-pagging-first" param="">&nbsp;</a>';
	        pageInner+='<a title="Prev"  class="ub-control button imgBtn img-pagging-prev"  param="'+(startPageList-1)+'">&nbsp;</a>';
	       
	    }
	    // 페이지 숫자를 찍으며 태그생성 (현재페이지는 강조태그)
	    for(var i=startPageList; i<=endPageList; i++){
	        if(i==pageNum){
	            pageInner = pageInner +"<em param="+(i)+" class='num' >"+(i)+"</em> ";
	        }else{
	            pageInner = pageInner +"<a param="+(i)+" class='num' >"+(i)+"</a> ";
	            
	        }
	    }

	    // 다음 페이지 리스트가 있을 경우
	    if(totalPageList>pageList){
	       
	        pageInner+='<a title="Next" class="ub-control button imgBtn img-pagging-next" param="'+(i)+'">&nbsp;</a>'; 
	        pageInner+='<a title="Last" class="ub-control button imgBtn img-pagging-last" param="'+(totalPage)+'">&nbsp;</a>';
	    }
	    // 현재 페이지리스트가 마지막 페이지 리스트일 경우
	    if(totalPageList==pageList){
	    }  
	    
	    // 페이징할 DIV태그에 우선 내용을 비우고 페이징 태그삽입
	    var gridId = $jqGrid.attr('id');
	    
	    // DivTab일경우 현재탭에 표시함.
	    var thisTab = $jqGrid.parents().find('div.ub-tab-content');
	    if(thisTab.size() == 0){
	    	thisTab = document;
	    }
	    
	    var pager = $(".ub-control.pagging[for='"+gridId+"']", thisTab); 
	    pager.empty();
	    pager.append("<span class='total-count'>Total : "+uxl.setComma(totalCount)+"</span>");
	    pager.append(pageInner);

		// 페이징 이벤트 바인딩
		$('a[param]', pager).click(function(event) {
			var pageNum = $(this).attr('param');
			uxl.grid.callFunction(gridId, pageNum);
		});
	    
	    
	    // options에 rowList값이 설정되어 있으면, row 리스트 콤보박스를 표시한다.
	    var rowList = optionsList[gridId].rowList;
	    if(uxl.isNotNull(rowList) && rowList.length > 0){
	    
		    $('.select-pagging', pager.parent()).remove();
		    var selectPageInner = '<div class="select-pagging"><label for="listPaging">Rows/Page&nbsp;</label></div>';
		    pager.after(selectPageInner);
	    
		    var selectPagging = $('.select-pagging', pager.parent());
		    var select = $('<select id="listPaging" class="page-rows" title="Rows/Page">');

	    	for(var i=0; i<rowList.length; i++){
	    		select.append('<option value="'+rowList[i]+'">'+rowList[i]+'</option>');
	    	}
	    	selectPagging.append(select);
	    
		    // 건수/페이지 콤보 값을 현재 그리드에 셋팅된 값으로 설정
		    $('.page-rows', selectPagging).val(pageSize);
	    
		    // 건수/페이지 콤보 변경시 그리드의 rownum 값을 변경하고, 1페이지로 Reload한다.
		    $('.page-rows', selectPagging).change(function(){
		    	$jqGrid.jqGrid('setGridParam', {rowNum:Number($(this).val())});		// 선택된 값으로 변경
		    	
		    	// 1페이지로 새로로딩
		    	uxl.grid.callFunction(gridId, 1);				
		    });
	    }
	};
	
	/**
	 * 페이지번호의 데이터를 호출하는 함수
	 */
	uxl.grid.callFunction = function(gridId, pageNum){
		var pager = $('.ub-control.pagging[for="'+gridId+'"]');
		
		var formName  = pager.attr('formId');
		var vfunction = pager.attr('function');
		var searchForm = $('#'+formName);
		
		var currPageSize = $jqGrid.jqGrid('getGridParam', 'rowNum');
		
		if(uxl.isNull(formName)){
			alert('formName 속성이 지정되지 않았습니다. 확인후 다시 실행해 주십시요.');
			return;
		}

		if(uxl.isNull(vfunction)){
			alert('function 속성이 지정되지 않았습니다. 확인후 다시 실행해 주십시요.');
			return;
		}

		
		if(searchForm != null) {
			if($('#'+_KEY_PAGE_NUMBER, $(searchForm)).size() == 0){
				uxl.addHidden(searchForm, _KEY_PAGE_NUMBER, pageNum);
			}else{
				$('#'+_KEY_PAGE_NUMBER, $(searchForm)).val(pageNum);
			}
			
			if($('#'+_KEY_PAGE_BLOCK, $(searchForm)).size() == 0){
				uxl.addHidden(searchForm, _KEY_PAGE_BLOCK, parseInt(pageNum/currPageSize));
			}else{
				$('#'+_KEY_PAGE_BLOCK, $(searchForm)).val(parseInt(pageNum/currPageSize));
			}

			if($('#'+_KEY_PAGE_SIZE, $(searchForm)).size() == 0){
				uxl.addHidden(searchForm, _KEY_PAGE_SIZE, currPageSize);
			}else{
				$('#'+_KEY_PAGE_SIZE, $(searchForm)).val(currPageSize);
			}
			
			//조회
			if(vfunction != null){
				eval(vfunction+'()');
			}
		}	
		
	};
	
	uxl.grid.sortColumn = function(gridId,index,iCol,sortorder){
		var formName   = $(".ub-control.pagging[for='"+gridId+"']").attr('formId');
		var searchForm = $('#'+formName);
		var vfunction = $(".ub-control.pagging[for='"+gridId+"']").attr('function');

		// orderColumn은 이전 검색된 컬럼정렬의 값이 들어 있으므로
		// 현재 orderColumn과 index를 비교하여 컬럼이 같은 컬럼의 정렬여부를 체크한다.
		if(orderColumn == index){
			if(orderAsc == 'DESC'){
				orderAsc = 'ASC'; 
			}else{
				orderAsc = 'DESC';
			}
		}else{
			orderAsc = 'ASC'; 
		}

		// 최종 변경된 index 값을 orderColumn에 반영한다.
		orderColumn = index;		

		if($('#'+_KEY_PAGE_ORDER_COLUMN).size() == 0){
			uxl.addHidden(searchForm, _KEY_PAGE_ORDER_COLUMN, orderColumn);
		}else{
			$('#'+_KEY_PAGE_ORDER_COLUMN).val(orderColumn);
		}
		
		if($('#'+_KEY_PAGE_ORDER_ASC).size() == 0){
			uxl.addHidden(searchForm, _KEY_PAGE_ORDER_ASC, orderAsc);
		}else{
			$('#'+_KEY_PAGE_ORDER_ASC).val(orderAsc);
		}
		
		//조회
		if(vfunction != null){
			eval(vfunction+'()');
		}
	};
	
	uxl.grid.getThisPage = function($jqGrid){
	    var thisTab = $jqGrid.parents().find('div.ub-tab-content');
	    if(thisTab.size() == 0){
	    	thisTab = document;
	    }
	};
	
	uxl.grid.plugin = {
		multiselect : {
			disableByCondition : {
				init : function(options){
					 if(uxl.isNotNull(options.ubPlugins.multiselect)){
						 if(uxl.isNotNull(options.ubPlugins.multiselect.disableByCondition)){
							 options.multiselect = true;
						 }
					 }
				}
				, checkPlugin : function(){
					var options = optionsList[$(this).attr('id')];
					var returnValue = false;
					if(options.multiselect != true){
						return false;
					}
					if(uxl.isNotNull(options.optionsOrg.ubPlugins)){
						if(uxl.isNotNull(options.optionsOrg.ubPlugins.multiselect)){
							if(uxl.isNotNull(options.optionsOrg.ubPlugins.multiselect.disableByCondition)){
								if(uxl.isFunction(options.optionsOrg.ubPlugins.multiselect.disableByCondition.condition)){
									returnValue = true;
								}
							}
						}
					}
					return returnValue;
				}
				, onCellSelect : function(rowid, iCol, cellContent, e){
					if(iCol == 0){
						//체크박스가 disabled 이면 선택하지 않음
						var ckbDis = $('tr#'+rowid+".jqgrow > td > input.cbox:disabled", $(this));
						if(ckbDis.length != 0){
							$(this).setSelection(rowid, false);
						}
						return false;
					}else{
						$(this).setSelection(rowid, false);
						return true;
					}
				}
				,afterInsertRow : function(rowid, rowdata, rowelem){
					//로우가 생성될 때 마다 조건을 체크하여 리턴값이 true면 disabled 처리
					var options = optionsList[$(this).attr('id')].optionsOrg;
					var result = options.ubPlugins.multiselect.disableByCondition.condition.call(this, $(this).getRowData(rowid)); 
					if(result){
						var checkbox = $('#jqg_'+$(this).attr('id')+'_'+rowid);
						checkbox.attr('disabled', true).attr('readonly','readonly');
					}
				}
				,onSelectAll : function(aRowids, status){
					//체크박스 전체선택 클릭 시 비활성화 체크박스 필터링
					if(status){
						var ckb = $('tr.jqgrow > td > input.cbox:disabled', $(this));
						ckb.removeAttr('checked');
						
						//선택된 로우값 치환
						var checkedRows = $.find('tr.jqgrow:has(td > input.cbox:checked)');
						var newSelarrrow = new Array();
						for(var i = 0 ; i < checkedRows.length ; i++){
							newSelarrrow.push(checkedRows[i].id);
						}
						$(this)[0].p.selarrrow = newSelarrrow;
						
						//체크되지 않은 로우 속성 변경
						var unCheckedRows = $.find('tr.jqgrow:has(td > input.cbox:disabled)');
						for(var i = 0 ; i < unCheckedRows.length ; i ++){
							$(unCheckedRows[i]).attr('aria-selected', 'false').removeClass('ui-state-highlight');
						}
					}
				}
			}
			, onlyOneCheck : {
				init : function(options){
					 if(uxl.isNotNull(options.ubPlugins.multiselect)){
						 if(uxl.isNotNull(options.ubPlugins.multiselect.onlyOneCheck)){
							 options.multiselect = true;
						 }
					 }
				}
				, checkPlugin : function(){
					var options = optionsList[$(this).attr('id')];
					var returnValue = false;
					if(options.multiselect != true){
						return false;
					}
					if(uxl.isNotNull(options.optionsOrg.ubPlugins)){
						if(uxl.isNotNull(options.optionsOrg.ubPlugins.multiselect)){
							if(uxl.isNotNull(options.optionsOrg.ubPlugins.multiselect.onlyOneCheck)
									&& options.optionsOrg.ubPlugins.multiselect.onlyOneCheck == true){
								returnValue = true;								
							}
						}
					}
					return returnValue;
				}
				, onSelectRow : function(rowid, status, e){
					if($('#jqg_'+$(this).attr('id')+'_'+rowid).is(":checked")){
		    			$(this).resetSelection();
				    	$(this).setSelection(rowid, false);
					}
				}
				, onSelectAll : function(aRowids, status){
					$(this).resetSelection();
				}
			}
		}
		, footerSum : {
			 init : function(options){
				 if(uxl.isNotNull(options.ubPlugins.footerSum)){
					 options.footerrow = true;
				 }
			 }
			 , checkPlugin : function(){
				var options = optionsList[$(this).attr('id')];
				var returnValue = false;
				if(options.footerrow != true){
					return false;
				}
				if(uxl.isNotNull(options.optionsOrg.ubPlugins)){
					if(uxl.isNotNull(options.optionsOrg.ubPlugins.footerSum)){
						returnValue = true;
					}
				}
				return returnValue;
			}
			, gridComplete : function(){
				var gridId = $(this).attr('id');
				var options = optionsList[gridId];
				var pluginData = options.optionsOrg.ubPlugins.footerSum;
				
				var colSums = new Array(pluginData.sumColumns.length);
				for(var z = 0 ; z < pluginData.sumColumns.length ; z++){
					var colName = pluginData.sumColumns[z];
					colSums[z] = $('#' + gridId).jqGrid('getCol', colName, false, 'sum');
					var dataStr = '{"' + colName + '":"' + colSums[z] + '"}';
					var data = JSON.parse(dataStr);
					$('#' + gridId).jqGrid('footerData', 'set', data);
				}
				
				var titleColName = $('#' + gridId).jqGrid('getGridParam','colModel')[pluginData.sumTitle.index].name;
				var dataStr = '{"' + titleColName + '":"' + pluginData.sumTitle.title + '"}';
				var data = JSON.parse(dataStr);
				$('#' + gridId).jqGrid('footerData', 'set', data);
			}
		}
		,cell:{
			/**
			 * 수정가능한 Cell에 ub-cell-editable ClassName을 추가하는 PlugIn
			 */
			editable : {
				checkPlugin : function(){
					var options = optionsList[$(this).attr('id')];
					return options.cellEdit;
				}
				, afterInsertRow : function(rowid, rowdata, rowelem){
					var options = optionsList[$(this).attr('id')];
					for(var i=0; i < options.colModel.length; i++){
						var model = options.colModel[i];
						if(uxl.isNotNull(model['editable'])){
							if(typeof(model.editable) == "boolean"){
								if(model.editable){
									var $editCells = $('td[aria-describedby=ResourceList_'+model.name+']:last', $jqGrid);
									$editCells.addClass("ub-cell-editable");
								}
							}
						}
					}
				}
			}
		}
		,paging:{
			init : function(options){
				/**
				 * 설정값 체크 paging 옵션이 없을 경우 초기값 설정 (top : false, buttom : true)
				 */
				if(uxl.isNull(options.ubPlugins.paging)){
					 options.ubPlugins.paging = { top : false, buttom : true };
				}
				
				var $source = $('.ub-control.pagging[for='+options.id+']').parent();
				var $clone  = $source.clone();
				
				// 원본 복사후 원본 삭제 처리
				$source.remove();
				
				var $target = $('#'+options.id).parent();
				if(options.ubPlugins.paging.top == true){
					$target.before($clone.clone());
				}
				
				if(options.ubPlugins.paging.buttom == true){
					$target.after($clone.clone());
				}
				
			}
		}
	};
	
})(jQuery, uxl);
