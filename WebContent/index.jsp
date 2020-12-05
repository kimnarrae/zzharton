<%--
 *
 *  설     명  : Dashboard Project 메인 화면
 *  작 성 자  : 
 *  작 성 일  : 2020-04-20
 *  버     전  : 1.0
 *  설     명  : 대시보드 프로젝트 메인 화면
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
	body {font:normal 12px Malgun Gothic,'굴림',Gulim,helvetica,arial,sans-serif;color:#25282d;background:#f1f1f1;margin:0px;}
	#main-frame{
	/* 	min-width:1900px; min-height:900px;  */
		min-width:1510px; min-height:735px; 
		overflow-x:auto; overflow-y:auto;
	}
	
	.main-btn-logo{
		width:220px; height:150px;
		position:absolute; top:-8px; left:-8px;
	}
	
	#main-bottom{
		/* min-height: 810px;  */
		min-height: 600px; 
		margin: 0px;padding: 15px; width: 98%; border:0px;overflow:auto;display: block;
	}
	
	/* #bodyiframe{  min-height: 810px; margin: 0px;padding: 0px;width: 100%;border: 0px;overflow: auto;display: block; } */
	#main-body{
		overflow:auto; padding-top:25px; padding-left:25px; border-radius:7px; border:1px solid #c3c4c7; height:585px; background:white; width:1475px;
	}
/* 	#main-contents{
		background:white; width:1000px; height:300px;border:1px dashed #c3c4c7; margin-top:127px; margin-left:227px;
	} */
	#main-contents{
		background:white; width:1430px !important; height:395px !important;
		border:1px dashed #c3c4c7; margin-top:50px !important; margin-left:10px !important;
	}
	#button-contents{
		background:white; width:1430px !important; height:70px !important;
		border:1px dashed #c3c4c7; margin-top:0px !important; margin-left:10px !important;	
	}
	
	.main-txt{
		padding:0px; font-size:17px; font-weight:normal;
	}
	.btn-area{
		width:699px; height:70px; float:left; /* width:50%; height:100%; */
	}
	.btn-area .button a{
		height:76%; width:100%; text-align: center; font-size: 20px; padding-top: 15px;
	}
</style>
<script type="text/javascript" src="page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript">
$(".header-img-box").hide();
</script>
	<title>짜트온</title>
</head>
<body id="main-frame">
<jsp:include page="/menu.jsp"></jsp:include>	
	<div id="main-bottom">
		<div id="main-body">
			<div id="main-contents">
				<div style="height:240px; text-align:center;margin-top:80px;">
					<div style="width:25%; float:left; height:100%;">
						<img class="main-img" src="/zzharton/page/image/common/img-chart-main.png" style="width:200px;height:200px;margin-top:20px;">
					</div>
					<div style="width:65%; float:left; height:80%;text-align:left;margin-top:45px;padding-right:20px;">
						<h1 style="color:rgb(255,185,51); margin-bottom:15px;">짜트온?</h1>
						<h3 class="main-txt">짜트온이란 엑셀 파일로 된 데이터를 읽어 차트 라이브러리를 활용해 데이터를 차트화 해주는 대시보드 프로그램입니다.</h3>
						<h3 class="main-txt">설정한 값에 따라 차트를 원하는 형태로 가공할 수 있고, 데이터를 이용하여 막대, 파이, 꺾은 선, 워드 클라우드 등 차트를 선택하여 확인 및 이미지를 저장할 수 있습니다.</h3>
					</div>
				</div>
<!-- 				<span id="btn-lbl-start" style="height:47px; float:right; margin-right:50px;font-size:16px;">
					<a  href="#" onclick="location.href='view/upload/uploadMain.jsp'">
						<label style="color:green;font-weight:bold;cursor:pointer;">지금 시작하기</label>
					</a>
				</span> -->
			</div>
			<div id="button-contents">
				<div class="btn-area">
					<span id="btn-elastic" class="button teal">
						<a href="#" onclick="location.href='view/elastic/elasticMain.jsp'">키워드 추출 프로그램</a>
					</span>
				</div>
				<div class="btn-area">
					<span id="btn-dashboard" class="button darkgreen">
						<a href="#" onclick="location.href='view/upload/uploadMain.jsp'">대시보드 프로그램</a>
					</span>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
