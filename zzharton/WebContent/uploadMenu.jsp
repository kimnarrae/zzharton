<%--
 *
 *  설     명  : Dashboard Project Menu.jsp
 *  작 성 자  : 
 *  작 성 일  : 2020-05-11
 *  버     전  : 1.0
 *  설     명  : 대시보드 프로젝트 메뉴
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
	.modal-inner-top{
		height:15px;
	}
	#tbl-set tr{
		height:30px;
	}
	.header-img-box{cursor:pointer;}
	.main-btn-logo{
		width:220px; height:150px;
		position:absolute; top:-8px; left:-8px;
	}
	.btn-modal-close img { 
	 	width: 20px; 
	 	float: right; 
	 	cursor: pointer; 
	}

	.line-header{
		width: 20px;
	    height: 5px;
	    border-radius: 3px;
	    margin-left: 1px;
	    margin-bottom:3px;
	}
	.line-header.gray{
		background:#888888;
	}
	.lbl-header{
		font-size:14px;
		font-weight:bold;
	}  

 #modal-contents-chat { 
 	margin:15px;  
 	margin-top: 10px; 
 	text-align: center; 
 	margin-left: 20px; 
 	margin-right: 20px; 
 	padding: 10px; 
 	position: relative; 
 } 	
</style>
<script type="text/javascript" src="/zzharton/page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript">
$(function(){
	fnGetSetModal();
	fnMenuEvent();
});

function fnMenuEvent(){
	$(".main-btn-logo").click(function(){
		location.href='/zzharton/index.jsp'
	});
	$("#btn-refresh").click(function(){
		location.reload();
	});

	$("#btn-setting").click(function(){
		var $targetDiv = $("#setting-contents");
		var openFlag = $targetDiv.attr("open-flag");
		if(openFlag == "Y"){
			$targetDiv.hide();
			$targetDiv.attr("open-flag","N");
		}else{
			$targetDiv.show();
			$targetDiv.attr("open-flag","Y");
		}
	});
}

function fnGetSetModal(){
	var html = "<div id='setting-contents' open-flag='N' style='position:absolute; z-index:1000; top:100px; padding:5px; right:50px; border: 1px solid #b7b7b7;background:white'>";
		html += '	<div class="modal-inner-top">';
		html += '		<a href="javascript:;"title ="닫기" class="btn-modal-close" id="btn-setting-close"><img  src="/zzharton/page/image/common/btn_close.png" style=""></a>';
		html += '	</div>';
		html += '	<div class="modal-inner-contents" style="max-height:720px; overflow-y:auto;padding:10px">';
		html += '		<table id="tbl-set">';
		html += '			<colgroup>';
		html += '				<col style="width:25%">';
		html += '				<col style="width:25%">';
		html += '				<col style="width:25%">';
		html += '				<col style="width:25%">';
		html += '			</colgroup>';
		html += '			<tbody>';
		html += '			<tr style="margin-bottom:10px;">';
		html += '				<td>';
		html += '					<div class="line-header gray"></div>';
		html += '					<label class="lbl-header">차트 설정</label>';
		html += '				</td>';
		html += '			</tr>';
		html += '			<tr id="">';
		html += '				<th style="text-align:left;">· 데이터 타입</th>';
		html += '				<td>';
		html += '					<select style="width:100px;">';
		html += '						<option value="oneData">하나</option>';
		html += '						<option value="twoData">둘</option>';
		html += '					</select>';
		html += '				</td>';
		html += '			</tr>';
		html += '			<tr>';
		html += '				<th colspan="4" style="text-align:left;border-top: 1px solid #b7b7b7;"><label style="margin-right:5px;">· 스타일</label></th>';
		html += '			</tr>';		
		html += '			<tr style="height:20px;">';
		html += '				<th style="text-align:left;">· 키워드1</th>';
		html += '				<td>';
		html += '					<select id="color-keyword" style="width:100px;">';
		html += '						<option value="red">빨강</option>';
		html += '						<option value="orange">주황</option>';
		html += '						<option value="yellow">노랑</option>';
		html += '						<option value="green">초록</option>';
		html += '						<option value="blue">파랑</option>';
		html += '						<option value="navy">남색</option>';
		html += '						<option value="purple">보라</option>';
		html += '						<option value="pink">핑크</option>';
		html += '					</select>';
		html += '				</td>';
		html += '				<th style="text-align:left;">· 키워드2</th>';
		html += '				<td>';
		html += '					<select id="color-keyword-two" style="width:100px;">';
		html += '						<option value="red">빨강</option>';
		html += '						<option value="orange">주황</option>';
		html += '						<option value="yellow">노랑</option>';
		html += '						<option value="green">초록</option>';
		html += '						<option value="blue">파랑</option>';
		html += '						<option value="navy">남색</option>';
		html += '						<option value="purple">보라</option>';
		html += '						<option value="pink">핑크</option>';
		html += '					</select>';
		html += '				</td>';
		html += '			</tr>';			
		html += '			</tbody>';
		html += '		</table>'
		html += '		<span class="button gray light_type" id="btnFile" style="float:right;margin-top:10px;">';
		html += '			<a href="#none" title="확인" style="height:22px; padding:0 10px;font-size:10px;line-height:20px;">';
		html += '				<label>확인</label>';
		html += '			</a>';
		html += '		</span>';

		html += '	</div>';		
		html += "</div>";
	$("#main-frame").append(html);	
	
	$("#setting-contents").hide();
}
</script>
	<title>짜트온</title>
</head>
<body>
<header>
	<div id="main-top">
		<!-- <h1 id="main-top-header">짜트온</h1> -->
		<span class="header-img-box" id="">
			<a><img class="main-btn-logo" src="/zzharton/page/image/logo/logo_zzharton.png"></a>
		</span>
		<span id="main-top-box" style="width:65px;">
			<span class="header-img-box" id="btn-refresh"><a><img class="main-btn-img" src="/zzharton/page/image/common/btn-refresh.png"></a></span>
<!-- 			<span class="header-img-box" id="btn-download"><a><img class="main-btn-img" src="/zzharton/page/image/common/btn-download.png"></a></span>-->
<!--  			<span class="header-img-box" id="btn-setting"><a><img class="main-btn-img" src="/zzharton/page/image/common/btn-setting.png"></a></span> -->
		</span>
	</div>
</header>
</body>
</html>
