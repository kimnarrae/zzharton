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
</style>
<script type="text/javascript" src="/zzharton/page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="/zzharton/page/js/jquery/plugin/jquery.form.js"></script>
<script type="text/javascript">
$(document).ready(function() {	
	fnEvent();
});

function fnEvent(){
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
						<div id="doc-info-area"style="height:470px;">
							<div id="info-header">
								<h3 style="display: inline;">원문 정보 확인</h3>
								<span class="button teal light_type" id="btn-search">
									<a href="#none" title="조회" style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">
										<label>조회</label>
									</a>
								</span>
							</div>
							<div>
								<img src="/zzharton/page/image/doc/doc-main.png">
							</div>					
						</div>						
					</div>
					<div>
						<h3>원문 추가 등록</h3>	
						<div id="doc-regist-area" style="padding-left:20px;">
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
					</div>					
				</div>
				<div class="width-3quarter">
					<article id="collection1LevelTitle" class="module column">
						<div class="module-content">

						</div>
					</article>
				</div>				
			</div>
		</div>
	</div>
</body>
</html>
