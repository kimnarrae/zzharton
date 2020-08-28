<%--
 *
 *  설     명  : Dashboard Upload Main 화면
 *  작 성 자  : 
 *  작 성 일  : 2020-04-27
 *  버     전  : 1.0
 *  설     명  : 대시보드 엑셀 업로드 메인 화면
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
	/* .module-content{border:1px dashed gray;} */
	.header-img-box{
		float:right;
	}
	#div-upload span{
		font:11px/1.8 Malgun Gothic, Arial, Helvetica, sans-serif;
	}
	.line-header{
		width: 29px; height: 5px; border-radius: 3px; margin-left: 1px; margin-bottom:3px;
	}
	.line-header.gray{
		background:#888888;
	}
	
	.line-header.yellow{
		background:#f6b031;
	}	
	
	.lbl-header{
		font:15px/bold Malgun Gothic, Arial, Helvetica, sans-serif;
		/* font-size:15px; font-weight:bold; */
	}
	
	#img-file-download{
		width:15px;
		height:15px;
	}
	
	.div-after-msg{
		height:165px; border:1px dashed gray; margin:10px 0px 0px 0px;
	}
	
	#setting-data{
		height:80px;
	}
	
	.data-after-header{
		height:30px; 
	}
	.setting-area{
		margin-bottom:25px;
	}

	#excel-data{
		height:286px; padding-left:15px; overflow-y:auto;
	}
	
	.span-excel-mainHeader{
		margin-top:10px;
	}
	.span-excel-result{
		margin-top:5px;
	}
	
	.excel-data-mainHeader{
		 font-size:13px; font-weight:bold;  color:#f6b031;
	}
	.excel-data-header{
		font-size:12px; font-weight:bold;
	}
	
	.excel-data-data{
		font-size:12px;  
	}	
	.keywordColorTwo{
		display:none;
	}
</style>
<script type="text/javascript" src="/zzharton/page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="/zzharton/page/js/jquery/plugin/jquery.form.js"></script>
<script type="text/javascript">
$(document).ready(function() {	
	fnEvent();
});

$(function(){
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
				<div class="width-oneThird" style="margin-top:58px;">
					<div class="module-content" style="background:#0a2c48;">
						 <img style="width:472px;height:475px;"src="/zzharton/page/image/common/img-main.PNG">
					</div>
				</div>
				<div class="width-twoThird">
					<article id="collection1LevelTitle" class="module column">
						<div class="module-content">
							<form id="uploadForm" name="uploadForm"  method="post" enctype="multipart/form-data">
								<div id="div-upload" style="height:60px;width:100%">
										<input type="file" id="file" name="file" accept=".xlsx, .xls" style="width:300px; border:1px solid gray;padding:0 0 0 1px;vertical-align:middle;font:11px/1.8 Malgun Gothic, Arial, Helvetica, sans-serif;" />
										<span class="button gray light_type" id="btnFile">
	 									<a href="#none" title="업로드" style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">
											<span>업로드</span>
										</a>
									</span>
										<!-- <input type="submit" id="btnFile"value="업로드"  style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">	 -->						
									<span class="fileDown" style="display:inline;margin-left:25px;cursor:pointer;">
										<img src="/zzharton/page/image/common/file-download.png" id="img-file-download">
										<a class="file_link" onmouseover="window.status=&quot;&quot;;return true" onmouseout="window.status=&quot;&quot;;return true" onclick="location.href=&quot;/zzharton/DATA/form_upload_data.xlsx&quot;">
											<span>양식 다운로드</span>
										</a>
									</span>									
									<span class="header-img-box" id="btn-refresh">
									<a><img class="main-btn-img" src="/zzharton/page/image/common/btn-refresh.png"></a>
									</span>															
								</div>
							</form>
							<form id="resultForm" name="resultForm" action="../dashboard/dashboardMain.jsp" method="post" >
								<div class="hidden-area" style="display:none;">
										<input type="text" id="result" name ="result" />	
								</div>
								<div class="setting-area"> 
						          	<div class="data-after-header">
						          		<div class="line-header yellow"></div>
						          		<label class="lbl-header">설정 데이터</label>
						          	</div>
						          	<div class="div-after-msg" id="setting-data">
						          		<table id="tbl-set">
											<colgroup>
												<col style="width:3%" />
												<col style="width:18%" />
												<col style="width:18%" />
												<col style="width:18%" />
												<col style="width:18%" />
												<col />
											</colgroup>
											<tbody>
											<tr>
												<td></td>
												<th style="text-align:left;"><label style="margin-right:5px;">· 데이터 타입</label></th>
												<td>
													<select id="dataType" name="dataType" style="width:100px;">
														<option value="oneData">하나</option>
														<option value="twoData">둘</option>
														<option value="etcData">기타</option>
													</select>
												</td>
											</tr>
											<tr>
												<td></td>
												<th colspan="4" style="text-align:left;">
													<hr/>
												</th>
											</tr>											
											<tr>
												<td></td>
												<th colspan="2" style="text-align:left;">
													<label style="margin-right:5px;">· 스타일</label>
												</th>
											</tr>
											<tr>
												<td></td>
												<th style="text-align:center; ">
													<label class="keywordColorOne" >키워드1</label>
												</th>
												<td style="text-align:left;">
													<select class="keywordColorOne" id="chartColor" name="chartColor" style="width:100px;">
														<option value="red">빨강</option>														
														<option value="yellow" selected>노랑</option>
														<option value="mint">청록</option>
														<option value="green">초록</option>
														<option value="skyBlue">하늘</option>
														<option value="blue">파랑</option>
														<option value="purple">보라</option>
														<option value="pink">핑크</option>
													</select>
												</td>
												<th style="text-align:center;">
													<label class="keywordColorTwo" >키워드2</label>
												</th>
												<td style="text-align:left;">
													<select class="keywordColorTwo" id="chartColorTwo" name="chartColorTwo" style="width:100px;">
														<option value="red">빨강</option>														
														<option value="yellow">노랑</option>
														<option value="mint" selected>청록</option>
														<option value="green">초록</option>
														<option value="skyBlue">하늘</option>
														<option value="blue">파랑</option>
														<option value="purple">보라</option>
														<option value="pink">핑크</option>
													</select>
												</td>
											</tr>	
											</tbody>
										</table>	
						          	</div>
					          	</div>
				          	</form>							
							<div id="div-upload-contents" style="height:330px;width:100%">
					          	<!--  엑셀 업로드 전  -->	          								
								<div class="before-excel-upload" id="header-area" style="height:30px;">
									<div class="line-header gray"></div>
									<label class="lbl-header">엑셀 업로드</label>
								</div>
								<div class="div-data-area before-excel-upload" id="bottom-area" style="background:#eeeeee; height:288px; margin:10px 0px 30px 0px;">
									<div id="div-warning-msg" style="line-height:288px; vertical-align:middle;text-align:center;">
										<img src="/zzharton/page/image/common/img-warning.png" style="width:25px; height:25px;">
										<label style="font-size:20px; font-weight:bold;margin-left :10px;">엑셀 데이터를 업로드 해주세요.</label>
									</div>									
								</div> 
							</div>	
						</div>
					</article>
				</div>				
			</div>
		</div>
	</div>
</body>
</html>
