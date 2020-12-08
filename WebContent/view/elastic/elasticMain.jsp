<%--
 *
 *  설     명  : Dashboard Elastic Search Main 화면
 *  작 성 자  : 
 *  작 성 일  : 2020-11-29
 *  버     전  : 1.0
 *  설     명  : 엘라스틱서치 메인화면
 * 
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.*" %>

<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/zzharton/page/style/common/base.css">
<link rel="stylesheet" href="/zzharton/page/style/common/button.css">
<meta charset="UTF-8" />
<style>
	#img-file-download{
		width:15px;	height:15px;
	}
	#refresh-img{
		width:20px; height:20px;
	}
	
	.tbl-header th{
		background:#8a96b4;border:1px solid #788299 !important; height:30px;margin:0; padding:0; color:#fff; font-size:14px; letter-spacing:-1px; line-height: 19px;
		position: sticky;top: 0;
	}
	.srh-btn{
 		position: absolute;bottom: 8px;right: 10px;display: inline-block;
   	 	cursor: pointer;
    	vertical-align: middle;
	}
	.srh-btn a{
		padding: 0 15px 0 8px;
	    border: 1px solid #585f6b;
	    background: #656d7c;
	    display: inline-block;
	    border-radius: 3px;
	    color: #fff;
	    font-size: 12px;
	    font-weight: bold;
	    line-height: 23px;
	}
	.srh-btn:hover a{
		background: #8b929f;
	}
	.srh-btn a::before {
	    display: inline-block;
	    content: '';
	    width: 13px;
	    height: 13px;
	    vertical-align: middle;
	    margin-top: -2px;
	    margin-right: 4px;
	    background: url(/zzharton/page/image/common/icon_srch-glass.png) no-repeat 0 0;
	}
	.grid-result tr{
		height:30px;
	}
	#table-area{
		overflow-y:auto;
		border: 1px solid #788299 !important;
    	border-right: 1px solid #788299 !important;
    	border-bottom: 1px solid #788299 !important;
    	min-height: 1px;
	    position: relative;
	    margin: 0;
	    padding: 0;
	    /* width: 99.4%; 
    	 margin-left: 2px; */
    	height:300px; 
	}
	#grid-result tr > td {
		border-left-width: 1px;
	    border-left-style: solid;
	    border-right-width: 1px;
	    border-right-style: solid;
	    border-color: #e5e5e5;
	    color: #5a5a5a;
	    font: normal 12px Malgun Gothic,'����',Gulim,helvetica,arial,sans-serif;
	    height: 28px;
	    overflow: hidden;
	    white-space: pre;
	    vertical-align: middle;
	    text-align: center;
	    height: 22px;
	    border-top: 0 none;
	    border-bottom-width: 1px;
	    border-bottom-style: solid;
	    margin: 0;
    	padding: 0;
	}
	
	#search-table tr{
		height:27px;
	}
	
	#search-table tr th{
		text-align: left;
    	padding-left: 3px;
	}
	#elastic-img{
		height: 210px;
	    vertical-align: middle;
	    margin-left: 105px;
	}
	
	.cal-wrap {position:relative;display:inline-block;}
	.cal-wrap .input-text {margin:0;display:inline-block;font:normal 12px Malgun Gothic,'����',Gulim,helvetica,arial,sans-serif;}
	.cal-wrap .btn-cal {position:absolute;top:-1px; right:0px; width:20px; height:20px;background:url(/zzharton/page/image/common/ico-cal.gif) no-repeat center;border:0;cursor:pointer;}
	.input-text{
		border: 1px solid #c3c3c3; text-align:center;
	}
</style>
<script type="text/javascript" src="/zzharton/page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="/zzharton/page/js/jquery/plugin/jquery.form.js"></script>
<script type="text/javascript">
$(document).ready(function() {	
	fnEvent();
	fnDrawGrid();
});

function fnEvent(){
	$("#btnSearch").click(function(){
		fnGetDocData();
	});
	
	$("#btnSearchDocInfo").click(function(){
		alert("btnSearchDocInfo click");	
	});
	
	$("#btnFile").click(function(){
		fnExportExcel();
	});
	
	$("#dataType").change(function(){
		var chkValue = $("#dataType option:selected").val();
		$(".move-dashboard-etc").remove();
		if(chkValue == "etcData"){
			$(".keywordColorTwo").hide();
			$(".keywordColorOne").hide();
			var buttonHtml = '<span class="button yellow move-dashboard-etc" style="float:right;margin-right:10px; cursor:pointer;">';
	        	buttonHtml += '	<a href="#none" onclick="fnMoveDashboard()" title="대시보드화면" style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">';
	       		buttonHtml += '		<label>대시보드 화면으로 이동</label>';
	        	buttonHtml += '	</a>';
	       	 	buttonHtml += '</span>';
        	$("#div-upload").append(buttonHtml);
        
		}else{
			$(".keywordColorOne").show();
			if(chkValue == "oneData"){
				$(".keywordColorTwo").hide();
			}else{
				$(".keywordColorTwo").show();
			}
		}

	});
	
	$("#btn-refresh").click(function(){
		location.reload();
	});
}

function fnMoveDashboard(){
	document.resultForm.submit();
}
function createData() { // 1. 자바스크립트 객체 형태로 전달 
//	var sendData = {srhKeywordType:$("#srh-keyword-type option:selected").val(), srhKeyword:$('#srh-keyword').val()}; 
	// 2. jQuery serialize함수를 사용해서 전달 
	//var sendData = $('#AjaxForm').serialize(); 
	//console.log(sendData); 
	return sendData; 
	// 3. 객체를 json 문자열로 만들어서 전달
	var sendData = JSON.stringify({srhKeywordType:$("#srh-keyword-type option:selected").val(), srhKeyword:$('#srh-keyword').val()});
	//console.log(sendData); //return {"data" : sendDta}; 
}

function fnGetDocData(){
    // FormData 객체 생성
     var formData = new FormData($('#searchForm')[0]);
    formData.append("srhKeywordType",$("#srh-keyword-type option:selected").val());
    formData.append("srhKeyword",$("#srh-keyword").val()); 
    var obj = new Object();
    obj.srhKeywordType = $("#srh-keyword-type option:selected").val();
    obj.srhKeyword = $("#srh-keyword").val();
    console.log(obj);
    var jsonData = JSON.stringify(obj);
    console.log(jsonData);
    $.ajax({
        cache : false,
        url : "/zzharton/GetDocument",
        type : 'POST', 
/*         data : formData, */
		data : createData(),
//		dataType:"json",
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success : function(data) {
        	var jsonData = JSON.parse(data);
        	setResultTable(jsonData);
        },
        error : function(xhr, status) {
            alert(xhr + " : " + status);
            $("#btn-refresh").click();
        }
    });	
}

function setResultTable(jsonData){
	//초기화
	$("#info-result").empty();
	$("#grid-result").empty();
	$(".search-data").val("");

	if(jsonData.length > 0){
		var infoObj = jsonData[0];
		console.log(infoObj);
		var infoHtml = "<tr>";
			infoHtml += "	<th>인덱스</th>";
			infoHtml += "	<td>"+infoObj.indexName+"</td>";
			infoHtml += "	<th>조회 문서 수</th>";
			infoHtml += "	<td>"+infoObj.totalCount+"</td>";
			infoHtml += "</tr>";
			infoHtml = "<tr>";
			infoHtml += "	<th colspan='4'>검색조건</th>";
			infoHtml += "</tr>";
			infoHtml = "<tr>";
			infoHtml += "	<th>일자</th>";
			infoHtml += "	<td>"+chgNullValue($("#dtDate").val())+"</td>";
			infoHtml += "	<th>작성자</th>";
			infoHtml += "	<td>"+chgNullValue($("#writer").val())+"</td>";
			infoHtml += "	<th>키워드</th>";
			infoHtml += "	<td>"+chgNullValue($("#srh-keyword").val())+"</td>";
			infoHtml += "	<th>제외키워드</th>";
			infoHtml += "	<td>"+chgNullValue($("#srh-not-keyword").val())+"</td>";			
			infoHtml += "</tr>";
			
			
			
		$("#info-result").append(infoHtml);
		
		for(var i=1; i<jsonData.length; i++){			
			var resultObj = jsonData[i];
			console.log(resultObj);
			var html = "<tr>";
				html += "	<td>"+resultObj.key+"</td>";
				html += "	<td>"+resultObj.collect+"</td>";
				html += "	<td>"+resultObj.user+"</td>";
				html += "	<td>"+resultObj.contents+"</td>";
				html += "	<td>"+resultObj.date+"</td>";
			
			$("#grid-result").append(html);
			
		}
	}
}

function chgNullValue(str){
	if(str == "" || str == null){
		str = "-"
	}
	return str;
}

function fnExportExcel(){
    // FormData 객체 생성
    var formData = new FormData($('#uploadForm')[0]);
    formData.append("dataType",$("#dataType option:selected").val());
    
    $.ajax({
        cache : false,
        url : "/zzharton/fUpload",
        type : 'POST', 
        data : formData,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success : function(data) {
        	$("#file").val("");
        	$(".move-dashboard-etc").remove();
        	
        	if(data == null || data == ""){
        		$("#div-warning-msg label").text("엑셀 데이터를 다시 입력해주세요.");
        		$("#btn-refresh").click();
        	}else if(data.match('^ERROR')){
        		alert(data);
        		$("#btn-refresh").click();
        	}else{
	            $(".before-excel-upload").remove();	            
	            $("#div-upload-contents").empty();
	            $("#div-upload").append(buttonHtml);
	            
	            var jsonObj = JSON.parse(data);  
	            var html =  '<div class="data-after-header" style="margin-top:15px;">';
	            	html += '	<div class="line-header yellow"></div>';
	            	html += '	<label class="lbl-header">엑셀 데이터 정보</label>';
	            	html += '</div>';	
	            	
	            	html += '<div class="div-data-area div-after-msg" id="excel-data">';
		            html += '	<span id="excel-data">';
		            html += '		<br/>';
		            html += '		<p class="span-excel-mainHeader">';
		            html += '			<label class="excel-data-mainHeader">업로드 파일 정보</label><br/>';
		            html += '		</p>';
		            html += '		<p class="span-excel-result">';
		        	html += '			<label class="excel-data-header">· 파일명</label><br/>';
		        	html += '			<label class="excel-data-result">'+jsonObj.fileName+'</label><br/>';
		            html += '		</p>';
		            html += '		<p class="span-excel-result">';		        	
		        	html += '			<label class="excel-data-header">· 파일 사이즈</label><br/>';
		        	html += '			<label class="excel-data-result">'+jsonObj.fileSize+'</label><br/>';
		            html += '		</p>';
		            html += '		<p class="span-excel-result">';
		        	html += '			<label class="excel-data-header">· 파일 서버 저장 경로</label><br/>';
		        	html += '			<label class="excel-data-result">'+jsonObj.filePath+'</label><br/>';
		            html += '		</p>';		            
		            html += '		<p class="span-excel-mainHeader">';
		        	html += '			<label class="excel-data-mainHeader">대시보드 활용 데이터</label><br/>';
		        	html += '		</p>';
		            html += '		<p class="span-excel-result">';
		        	html += '			<label class="excel-data-result">'+jsonObj.resultData+'</label><br/>';
		            html += '		</p>';		        	
		        	html += '	</span>';
	            	html += '</div>';
	            $("#div-upload-contents").append(html);
	            
	            var buttonHtml = '<span class="button yellow move-dashboard" style="float:right;margin-right:10px; cursor:pointer;">';
	            	buttonHtml += '	<a href="#none" onclick="fnMoveDashboard()" title="대시보드화면" style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">';
	           		buttonHtml += '		<label>대시보드 화면으로 이동</label>';
	            	buttonHtml += '	</a>';
	           	 	buttonHtml += '</span>';
	            $("#div-upload").append(buttonHtml);
	            
	            //전달 데이터 저장
	            $("#result").val(jsonObj.resultData);
        	}

        },
        error : function(xhr, status) {
            alert(xhr + " : " + status);
            $("#btn-refresh").click();
        }
    });
}
function fnDrawGrid(){
	
}
</script>
<title>짜트온</title>
</head>
<body id="main-frame">
<jsp:include page="/menu.jsp"></jsp:include>
	<div id="main-bottom">
		<div id="main-body">
			<div class="module-wrap">
				<div class="width-quarter" style="margin-top:20px;">
					<div class="module-content">
						<h3 style="padding:0px;">원문 추가 등록</h3>	
						<div id="doc-regist-area" style="margin-bottom: 30px;">
						<form id="uploadForm" name="uploadForm"  method="post" enctype="multipart/form-data">
							<div id="div-upload" style="height:40px;width:100%">
								<input type="file" id="file" name="file" accept=".xlsx, .xls" style="width:180px; border:1px solid gray;padding:0 0 0 1px;vertical-align:middle;font:11px/1.8 Malgun Gothic, Arial, Helvetica, sans-serif;" />
								<span class="button gray light_type" id="btnFile">
 									<a href="#none" title="업로드" style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">
										<span>업로드</span>
									</a>
								</span>
									<!-- <input type="submit" id="btnFile"value="업로드"  style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">	 -->						
								<span class="fileDown" style="margin-top: 3px;cursor:pointer;">
									<img src="/zzharton/page/image/common/file-download.png" id="img-file-download">
									<a class="file_link" onmouseover="window.status=&quot;&quot;;return true" onmouseout="window.status=&quot;&quot;;return true" onclick="location.href=&quot;/zzharton/DATA/form_upload_doc.xlsx&quot;">
										<span>양식 다운로드</span>
									</a>
								</span>															
							</div>
						</form>
						</div>
						<div style="margin-bottom: 10px;">
							<img src="/zzharton/page/image/doc/doc-main.png" id="elastic-img">
						</div>										
						<div id="doc-info-area" style="height:200px;">					
							<div id="info-header">
								<h3 style="padding:0px;">검색 조건</h3>
						    	<div style="margin-top:10px;position: relative;border: 1px solid #c3c4c7;background: #f7f8fc;padding: 9px 15px;">
						    	<form id="searchForm" name="searchForm"  method="post" enctype="multipart/form-data">
						    	<table>
						        	<colgroup>
						        		<col style="width:25%">
						        		<col style="width:75%">
						        		<col />
						        	</colgroup>
						        	<tbody id="search-table">
							        	<tr>							        	
							        		<th>일자</th>
							        		<td>
						              			<input title="시작시간" id="dtDate" type="text" class="input-text search-data" value="" style="width:206px;" placeholder="날짜형식 : YYYY-MM-DD">
							        		</td>
							        	</tr>
							        	<tr>							        	
							        		<th>작성자</th>
							        		<td>
							        			<input class="input-text search-data" id="writer" type="text" style="width:206px;">
							        		</td>
							        	</tr>							        	
							        	<tr>							        	
							        		<th>키워드</th>
							        		<td>
							        			<select id="srh-keyword-type" style="width:52px;">
							        				<option value="OR">OR</option>
							        				<option value="AND">AND</option>
							        			</select>	
							        			<input class="input-text search-data" id="srh-keyword" type="text" style="width:150px;">
							        		</td>							        		
							        	</tr>
							        	<tr>
							        		<th>제외키워드</th>
							        		<td>
							        			<input class="input-text search-data" id="srh-not-keyword" type="text" style="width:206px;">
							        		</td>
							        	</tr>
							        	<tr>
							        		<th colspan="2">
							        			<span class="srh-btn" id="btnSearch"><a>검색</a></span>
							        		</th>
							        	</tr>					        
						        	</tbody>					    	
						    	</table>
						    	</form>						    	
						    	</div>								
							</div>					
						</div>						
					</div>
					<div>
					</div>					
				</div>
				<div class="width-3quarter" style="width:70%; margin-top:20px;table-layout: fixed;">
					<div class="module-content">
							<h3 style="padding:0px;">원문 정보</h3>	
							<div style="height:120px;margin-top:10px;position: relative;border: 1px solid #c3c4c7;background: #f7f8fc;padding: 9px 15px;margin-bottom: 12px;">
						    	<table>
						        	<colgroup>
						        		<col style="width:10%">
						        		<col style="width:10%">
						        		<col style="width:10%">
						        		<col style="width:10%">
						        		<col style="width:10%">
										<col style="width:25%">
						        		<col style="width:10%">
						        		<col style="width:25%">		
						        	</colgroup>
						        	<tbody id="info-result"></tbody>					    	
						    	</table>
							</div>
					    	<h3 style="padding:0px;">원문 목록</h3>	
					    	<div class="tableWrap" id="table-area">
					    	<!-- <div id="header-table-area"> -->
					    	
					        <table id="result-table" style="table-layout: fixed;width:100%;border:0 !important;">
					        	<colgroup>
					        		<col style="width:5%">
					        		<col style="width:10%">
					        		<col style="width:10%">					        		
					        		<col style="width:55%">
					        		<col style="width:10%">
					        	</colgroup>
					        	<thead id="grid-header">
						        	<tr class="tbl-header">
						        		<th>문서키</th>
						        		<th>수집코드</th>
						        		<th>글쓴이</th>
						        		<th>문서내용</th>
						        		<th>작성일자</th>
						        	</tr>
					        	</thead>
					        </table>
					   <!--      </div>
					        <div id="result-table-area"> -->
					        <table id="result-table" style="table-layout: fixed;overflow-y:auto;width:100%;border:0 !important;">
					        	<colgroup>
					        		<col style="width:5%">
					        		<col style="width:10%">
					        		<col style="width:10%">					        		
					        		<col style="width:55%">
					        		<col style="width:10%">
					        	</colgroup>
					        	<tbody id="grid-result" style="table-layout: fixed;">
					        	</tbody>
					        </table> 
					        </div>					        
					    </div>
					</div>
				</div>				
			</div>
		</div>
	</div>
</body>
</html>
