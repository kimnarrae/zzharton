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
	.header-img-box{cursor:pointer;}
	.main-btn-logo{
		width:220px; height:150px;
		position:absolute; top:-8px; left:-8px;
	}
</style>
<script type="text/javascript" src="/zzharton/page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript">
$(function(){
	fnMenuEvent();
});

function fnMenuEvent(){
	$(".main-btn-logo").click(function(){
		location.href = '/zzharton/index.jsp';
	});
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
	</div>
</header>
</body>
</html>
