<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.*" %>
<% 
	request.setCharacterEncoding("UTF-8");
	String result = (String)request.getParameter("result");
	String dataType = (String)request.getParameter("dataType");
	String chartColor = (String)request.getParameter("chartColor");
	String chartColorTwo = (String)request.getParameter("chartColorTwo");
%>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/zzharton/page/style/common/base.css"/>
<link rel="stylesheet" href="/zzharton/page/style/common/button.css"/>
<link rel="stylesheet" href="/zzharton/page/style/css/d3cloud.css"/>
<link rel="stylesheet" href="/zzharton/page/style/css/vis-network.css"/>
<meta charset="UTF-8" />
<style> 
	.module-wrap{
		height:465px; width:98%; /* border:1px dashed gray; */ border:0px;
	}
	.dash-width-half{
		height: 150px; width: 150px; margin: 2.5px;
	}	
	.btn-img-dashboard{
		height: 145px; width: 145px; cursor:pointer; padding:5px; background:#3a495f; border-radius:7px; background:#0e3d67 url(/zzharton/page/image/dashboard/common/bg_section.png) repeat-x
	}
	.btn-img-dashboard:hover {
		background:#61739b;
	}
	.on{
		background:#ffffff; /* border:1px solid #7c89a2; */
	}
	.on:hover{
		background:#ffffff; /* border:1px solid #7c89a2; */
	}	
	.btn-row{
		margin-bottom:5px;
	}
	#grid-result{
		font-size:20px;
		font-weight:bold;
		color:#ffffff;
	}
	.orange-txt{
		color:#ff6600;
	}
	.tbl-keyword{
		width:100%;height:100%;
	}
	.tbl-keyword-header{
		border-bottom:1px solid #ffffff; text-align:center; height:35px;
	}
	.arrSortGrid {
		height:40px;
	}
	.disabledClick a img{
		background:#444444;
	}
	.disabledClick a img:hover{
		background:#444444;
	}
	#btn-back label{
		cursor:pointer;
	}
</style>
<script type="text/javascript" src="/zzharton/page/js/jquery/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="/zzharton/page/js/jquery/ui/jquery-ui-1.9.2.min.js"></script>

<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/bootstrap.js"></script>

<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/d3/d3.min.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/d3/d3cloud.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/d3/vis.js"></script>

<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/highcharts.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/highcharts-more.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/highcharts-3d.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/highCharts/modules/data.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/exporting.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/offline-exporting.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/canvas-tools.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/highcharts-export-clientside.js"></script>
<script type="text/javascript" charset="UTF-8" src="/zzharton/page/js/highchart/highCharts/themes/default.js"></script>

<script type="text/javascript">
var chartDiv = "div-chart-area";
var chartData = new Object();
var arrChartData = new Array();
var colorObj = new Object();
	colorObj["red"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#F17579'],[1,'#EA3E45']]};
	colorObj["orange"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#C2AE9B'],[1,'#A88D72']]};
	colorObj["yellow"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#F9BE4A'],[1,'#F7A302']]};
	colorObj["mint"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#6AE0BB'],[1,'#3CD4A7']]};
	colorObj["green"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#A0DF61'],[1,'#82D136']]};
	colorObj["skyBlue"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#75D2F1'],[1,'#3DC0EA']]};
	colorObj["blue"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#5E9DEC'],[1,'#2F7AE4']]};
	colorObj["purple"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#9076D2'],[1,'#734DC4']]};
	colorObj["pink"] = {linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#F175BF'],[1,'#EA3FA6']]};

var arrChartColor = new Array();
var arrChartTwoData = new Array();
var chartTwoData = new Object();
var chartBarLineData = new Object();

$(function(){
	fnSetData();
	fnEvent();	
});

function fnSetData(){
	var data = '<%=result%>';
	var dataType = '<%=dataType%>'; 
	var chartColor = '<%=chartColor%>';
	var chartColorTwo = '<%=chartColorTwo%>';

	$(".btn-dashboard").addClass("disabledClick");
	$("."+dataType).removeClass("disabledClick");
	
	var jsonDataObj = JSON.parse(data);	
	
	if(dataType == "oneData"){
		//Chart Style Setting
		arrChartColor.push(colorObj[chartColor]);
		
		//Chart Data Setting
		chartData = jsonDataObj;
		
		for(var i=0; i<jsonDataObj.keyword.length;i++){
			var subObj = new Object();
			
			var keyword = jsonDataObj.keyword[i];
			var count = jsonDataObj.count[i];
			var rank = jsonDataObj.rank[i];

			subObj["name"] = keyword;
			subObj["y"] = count;
			subObj["rank"] = rank;
			
			arrChartData.push(subObj);
		}
	}else if(dataType == "twoData"){

		
		//Chart Data Setting
		console.log(data);
		var twoJsonDataObj= JSON.parse(data);
		
		console.log(jsonDataObj);
		
		chartTwoLineData = twoJsonDataObj;
		
		chartBarLineData = jsonDataObj;
		
		chartBarLineData["data"][0]["type"] = 'column';
		chartBarLineData["data"][0]["zIndex"] = 1;
		chartBarLineData["data"][0]["yAxis"] = 1;
		
		chartBarLineData["data"][1]["type"] = 'line';
		chartBarLineData["data"][1]["zIndex"] = 2;
		chartBarLineData["data"][1]["yAxis"] = 0;	
		
		//Chart Style Setting
		arrChartColor.push(colorObj[chartColor]);
		arrChartColor.push(colorObj[chartColorTwo]);
	}else{
		arrChartColor.push(colorObj["yellow"]);
	}
}

function fnEvent(){
	$("#btn-back").click(function(){
		location.href = '../upload/uploadMain.jsp';
	//	location.reload();
	});
	
	$(".btn-dashboard").click(function(){
		if($(this).hasClass("disabledClick")){
			alert("지원하지 않는 차트 형식입니다.");
			return ; 
		}else{
			var chartType = $(this).attr("chart-type");
			
			$(".btn-dashboard").children("a").children("img").removeClass("on");
			$(this).children("a").children("img").addClass("on");
			
			fnGetChart(chartType);
		}

	});
}

function fnGetChart(chartType){
	$("#"+chartDiv).empty();
	
	if(chartType == "tagcloud"){
		fnDrawTagColudChart();
	}else if(chartType == "bar"){
		fnDrawBarChart();
	}else if(chartType == "pie"){
		fnDrawPieChart();
	}else if(chartType == "line"){
		fnDrawLineChart();
	}else if(chartType == "bar-line"){
		fnDrawBarLineChart();
	}else if(chartType == "two-line"){
		fnDrawTwoLineChart();
	}else if(chartType == "relation"){
		fnDrawRelationChart();
	}else if(chartType == "grid"){
		fnDrawGridChart();
	}else if(chartType == "bubble"){
		fnDrawBubbleChart();
	}else{
		alert("오류입니다.");
		return;
	}
}

function fnDrawTagColudChart(){//d3태그클라우드
	$("#"+chartDiv).css("background","#0e3d67");
	
	var max_weight = 0;
	var arr_data = new Array();//데이터배열
	var word_list = [
		{rn:7,code:"cd1",text:"키워드3",count:10}, {rn:6,code:"cd2",text:"키워드2",count:20}, {rn:4,code:"cd3",text:"키워드1",count:30}, 
		{rn:2,code:"cd4",text:"대시보드",count:40}, {rn:1,code:"cd5",text:"짜트온",count:50}, {rn:5,code:"cd6",text:"키워드4",count:25},
		{rn:3,code:"cd7",text:"차트",count:35}
	];
	var fnMakeData = function(){
		for(var i=0; i<arrChartData.length; i++){
			if(max_weight<arrChartData[i].y){//value 최대값 구하기
				max_weight = arrChartData[i].y;
			}
			arr_data.push({
				"text" : arrChartData[i].name.toString(),
				"code" : i,
				"size" : arrChartData[i].y,
				"point": arrChartData[i].y,
				"pointType": "점수합계",
				"wordCnt": arrChartData[i].y,
				"docCnt": 1,
				"weight":arrChartData[i].y,
				"haskey":"Y",
				"rn" : arrChartData[i].rank,
				"rank" : arrChartData[i].rank 
			});
		}
	}
	
	fnMakeData();
	
	var margin = {top: 20, right: 120, bottom: 200, left: 120};
	var width = $("#"+chartDiv).width();
	var height = $("#"+chartDiv).height();
	var fill = d3.scale.category20();

    d3.layout.cloud().size([width, height])
    .timeInterval(20)
	.words(arr_data.map(function(d){//폰트 크기
		var font_max = 180;//폰트 최대 값
		var font_min = 20;//폰트 최소값
		var font_size = (d.size/max_weight)*font_max;
		if(font_size<font_min){
			font_size = font_min;
		}
		return {"text": d.text, "size": font_size, "code":d.code, "point":d.point, "wordCnt":d.wordCnt,"docCnt":d.docCnt, "rn" :d.rn,"haskey":d.haskey};
	}))
    .fontSize(function(d) { return d.size; })
    .text(function(d) { return d.text; })
	.rotate(function(){ 
		var text_angle = 1;
		return ~~(Math.random() * text_angle) * 90;
	})		
    .font("Impact")
    .on("end", draw)
    .start();
	
	
    function draw(words) {
        d3.select("#"+chartDiv).append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) {var fSize = 20; if(d.size > 0){fSize = d.size; } return fSize + "px"; })
            .style("font-family", "Impact")
			.style("fill", function(d, i) {
				var fillColor="";
				if(i==0){fillColor = "#31bf73"}
	 			else if(i>=1 && i<=2){fillColor = "#eb6277"}
	 			else if(i>=3 && i<=4){fillColor = "#00b4ff"}
	 			else if(i>=5 && i<=6){fillColor = "#dabb5b"}
	 			else if(i>=7 && i<=8){fillColor = "#876ece"}
	 			else if(i>=9 && i<=10){fillColor = "#6487b7"}
	 			else if(i>=11 && i<=12){fillColor = "#C2AE9B"}
	 			else if(i>=13 && i<=14){fillColor = "#9076D2"}
	 			else if(i>=15){fillColor = "#F175BF"}
	 			else{fillColor = "#444444"}
				return fillColor; 
			})
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      }
}

function fnDrawBarChart(){	
	Highcharts.setOptions({
		lang:{
			thousandsSep:','
		}
	});
	Highcharts.getOptions().colors = arrChartColor;
	var chart = new Highcharts.Chart({
		chart:{
			renderTo : chartDiv,  
			type:"column",
			backgroundColor:'#0e3d67',
			color:"#F0F0F0"
		},
	    credits:{ 
	    	enabled:false 
	    },	    

	    title: {
	        text: ''
	    },
	    subtitle: {
	        text: ''
	    },
	    xAxis: {
	       categories: chartData.keyword,
	       labels: {
		       style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
	        }	   
	    },
	    yAxis: {
			min:0,
			title:{
				text:""
			},
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			}
	    },
	    tooltip: {
			backgroundColor:'rgba(0,0,0,0.85)',
			style:{
				color:"#F0F0F0",
				font:"10px Malgun Gothic"
			},
	        headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
	        pointFormat: '<tr><td style="padding:0"><b>{point.y}</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
			column:{
				colorByPoint: true,
				borderColor:undefined,
				dataLabels: {
					enabled: true,
					distance : -15,
					style:{
						"color":"#F0F0F0",
						"textShadow":"0px",
						"font":"10px Malgun Gothic"
					}
	            }
			},
			series : {
				colorByPoint: true,
				cursor: 'pointer',
				borderColor: undefined,
				states : {
					hover : {
						enabled : false
					}
					,select : {
						color:"#F0F0F0",
						borderColor:undefined
					}
				},
				point: {
					events: {
						//클릭 시
						click: function(event){
						}
					}
				}				
			}
	    },
	    legend: {
	         enabled: false
	    },
	    series: [{
	        data: chartData.count
	    }]
	});
}

function fnDrawPieChart(){	
	Highcharts.setOptions({
		lang:{
			thousandsSep:','
		}
	});	
	Highcharts.getOptions().colors = [
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#F17579'],[1,'#EA3E45']]},
		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#F9BE4A'],[1,'#F7A302']]},
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#dabb5b'],[1,'#dabb5b']]},
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#C2AE9B'],[1,'#A88D72']]}, 
		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#A0DF61'],[1,'#82D136']]},
		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#6AE0BB'],[1,'#3CD4A7']]},		
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#75D2F1'],[1,'#3DC0EA']]}, 		
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#5E9DEC'],[1,'#2F7AE4']]},		
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#F175BF'],[1,'#EA3FA6']]},
 		{linearGradient:{x1:0,x2:0,y1:0,y2:1}, stops:[[0,'#9076D2'],[1,'#734DC4']]}
		
	];	
	var chart = new Highcharts.Chart({
		chart:{
			renderTo : chartDiv,  
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie',
			backgroundColor:'#0e3d67',
			color:"#F0F0F0"
		},
	    credits:{ 
	    	enabled:false 
	    },	    

	    title: {
	        text: ''
	    },
	    subtitle: {
	        text: ''
	    },
	    xAxis: {
		       categories: chartData.keyword,
		       labels: {
			       style : {
						fontSize : "10px",
						fontFamily : "Verdana , sans-serif",
					    color:"#ffffff"
					}
		        }	   
	    },
	    yAxis: {
			min:0,
			title:{
				text:""
			},
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			}
	    },
	    tooltip: {
			backgroundColor:'rgba(0,0,0,0.85)',
			style:{
				color:"#F0F0F0",
				font:"10px Malgun Gothic"
			},
	        headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
	        pointFormat: '<tr><td style="padding:0"><b>{point.y}</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
			column:{
				colorByPoint: true,
				borderWidth: 2,
				dataLabels: {
					enabled: true,
					distance : -15,
					style:{
						"color":"#F0F0F0",
						"textShadow":"0px",
						"font":"10px Malgun Gothic"
					}
	            }
			},
			series : {
				borderColor:undefined,
				allowPointSelect : true,
				cursor: 'pointer'			
			}
	    },
	    legend: {
	         enabled: false
	    },
	    series: [{
	        data: arrChartData
	    }]
	});	
}

function fnDrawLineChart(){
	Highcharts.setOptions({
		lang:{
			thousandsSep:','
		}
	});
	Highcharts.getOptions().colors = arrChartColor;
	var chart = new Highcharts.Chart({
		chart:{
			renderTo : chartDiv,  
			type:"line",
			backgroundColor:'#0e3d67',
			color:"#F0F0F0"
		},
	    title: {
	        text: ''
	    },
	    subtitle: {
	        text: ''
	    },
	    xAxis: {
	       categories: chartData.keyword,
	       labels: {
		       style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
	        }
	    },
	    yAxis: {
	        title: {
	            text: ''
	        },
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			},	        
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color:"#F0F0F0"
	        }]
	    },
	    credits:{ 
	    	enabled:false 
	    },
	    legend: {
        	enabled:false
	    },
	    plotOptions: {
	    	column: {
                colorByPoint: true
            },
	        series: {
	        	borderColor:undefined,
	            states : { 
		        	hover:{ //hover시 라인 굵기는 변화 없도록함
		        		lineWidthPlus:0
		        	}
	        	},
	        	cursor: 'pointer',
	            marker: {
		            states : {
						hover : {
							enabled : true
						}
					}	
	            }
	        }
	    },	    
	    series: [{
	    	type: 'line',
	        name: '건수',
	        data: chartData.count,
	        index:0,
	        marker: {
	        	symbol:'circle'  //marker 모양 (원으로 설정)   
				,radius:5
	        }
	  	  	,lineWidth:2
	    }]
	});	
}

function fnDrawBarLineChart(){
	Highcharts.setOptions({
		lang:{
			thousandsSep:','
		}
	});	
	Highcharts.getOptions().colors = arrChartColor;
	var chart = new Highcharts.Chart({
		chart:{
			renderTo : chartDiv
            ,zoomType: 'xy',
			backgroundColor:'#0e3d67',
			color:"#F0F0F0"
        },
	    title: {
	        text: ''
	    },
	    subtitle: {
	        text: ''
	    },
	    credits:{ 
	    	enabled:false 
	    },	    
        xAxis: {
 	       categories: chartBarLineData.name,
	       labels: {
		       style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
	        }
        },
        yAxis: [{ 
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			},
            opposite: true

        }, {
            gridLineWidth: 0,
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			}

        }],
	    legend: {
        	itemStyle:{
				fontSize : "10px",
				fontFamily : "Verdana , sans-serif",
			    color:"#ffffff"
        	}
	    },
        plotOptions: {
            bubble: {
				dataLabels: {
					enabled: true,
					distance : -15,
					style:{
						"color":"#F0F0F0",
						"textShadow":"0px",
						"font":"10px Malgun Gothic"
					}
	            },
                minSize: '12%',
                maxSize: '23%'
            },
			series : {
				allowPointSelect : true,
				cursor: 'pointer',
				borderColor:undefined,
				states : {
					hover : {
						enabled : false
					}
					,select : {
						color:"#F0F0F0",
						borderColor:undefined
					}
				},
				point: {
					events: {
						//클릭 시
						click: function(event){
						}
					}
				}				
			}
        },
        series: chartBarLineData.data
    });
}

function fnDrawTwoLineChart(){
	Highcharts.setOptions({
		lang:{
			thousandsSep:','
		}
	});
	Highcharts.getOptions().colors = arrChartColor;
	var chart = new Highcharts.Chart({
		chart:{
			renderTo : chartDiv,  
			type:"line",
			backgroundColor:'#0e3d67',
			color:"#F0F0F0"
		},
	    title: {
	        text: ''
	    },
	    subtitle: {
	        text: ''
	    },
	    xAxis: {
	       categories: chartTwoLineData.name,
	       labels: {
		       style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
	        }	   
	    },
	    yAxis: {
	        title: {
	            text: ''
	        },
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			},	        
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    credits:{ 
	    	enabled:false 
	    },	    

	    legend: {
        	itemStyle:{
				fontSize : "10px",
				fontFamily : "Verdana , sans-serif",
			    color:"#ffffff"
        	}
	    },
	    plotOptions: {
	        series: {
	        	borderColor:undefined,
	            states : { 
		        	hover:{ //hover시 라인 굵기는 변화 없도록함
		        		lineWidthPlus:0
		        	}
	        	},
	        	cursor: 'pointer',
	            marker: {
		            states : {
						hover : {
							enabled : true
						}
					}	
	            },
	            point: {
	                events: {
	                    click: function () {
	                    }
	                }
	            }
	        }
	    },	    
	    series: chartTwoLineData.data
	});		
}

function fnDrawRelationChart(){
	var nodes = new Array();
	var edges = new Array();
	var network = null;
	var obj = {};
	var arr_word = new Array();
	var arr_word_r = new Array();
	arr_word.push({"id": "A", "value": "80", "label": "기준", "title":"80","group":"standard","font":{color:'rgb(49, 191, 115)'}});
	arr_word.push({"id": "A1", "value": "50", "label": "기준1", "title":"50","group":"myGroup","font":{color:'#F9BE4A'}});
	arr_word.push({"id": "A2", "value": "50", "label": "기준2", "title":"50","group":"myGroup","font":{color:'#F9BE4A'}});
	arr_word.push({"id": "A3", "value": "20", "label": "기준3", "title":"20","group":"myGroup","font":{color:'#F9BE4A'}});
	
	arr_word.push({"id":"TEST", "value":"80", "label":"키워드","title":"80","group":"standard","font":{color:'rgb(49, 191, 115)'}});
	arr_word_r.push({"id":"TEST1", "value":"20", "label":"키워드1","title":"20","group":"TEST1","font":{color:'white'}});
	arr_word_r.push({"id":"TEST2", "value":"30", "label":"키워드2","title":"30","group":"TEST1","font":{color:'white'}});
	arr_word_r.push({"id":"TEST3", "value":"40", "label":"키워드3","title":"40","group":"TEST1","font":{color:'white'}});	
	arr_word_r.push({"id":"TEST4", "value":"20", "label":"키워드4","title":"20","group":"TEST1","font":{color:'white'}});
	arr_word_r.push({"id":"TEST5", "value":"30", "label":"키워드5","title":"30","group":"TEST1","font":{color:'white'}});
	
	arr_word_r.push({"id":"TEST6", "value": "40", "label":"키워드6","title":"40","group":"TEST1","font":{color:'white'}});	
	arr_word_r.push({"id":"TEST7", "value": "20", "label":"키워드7","title":"20","group":"TEST1","font":{color:'white'}});
	arr_word_r.push({"id":"TEST8", "value": "30", "label":"키워드8","title":"30","group":"TEST1","font":{color:'white'}});
	arr_word_r.push({"id":"TEST9", "value": "40", "label":"키워드9","title":"40","group":"TEST1","font":{color:'white'}});
	arr_word_r.push({"id":"TEST10", "value": "40", "label":"키워드10","title":"40","group":"TEST1","font":{color:'white'}});
	
	var thing = arr_word.concat(arr_word_r);
	edges.push({
		from : "A"
		,to : "A1"
	});
	edges.push({
		from : "A"
		,to : "A2"
	});
	edges.push({
		from : "TEST"
		,to : "TEST2"
	});
	edges.push({
		from : "TEST"
		,to : "TEST3"
	});
	edges.push({
		from : "TEST"
		,to : "TEST5"
	});			
	edges.push({
		from : "A1"
		,to : "TEST1"
	});
	
	edges.push({
		from : "A1"
		,to : "TEST2"
	});
	edges.push({
		from : "A1"
		,to : "TEST3"
	});

	edges.push({
		from : "A1"
		,to : "TEST4"
	});
	edges.push({
		from : "A1"
		,to : "TEST5"
	});
	
	edges.push({
		from : "A2"
		,to : "TEST6"
	});
	
	edges.push({
		from : "A2"
		,to : "TEST7"
	});
	
	edges.push({
		from : "A2"
		,to : "TEST8"
	});
	edges.push({
		from : "A2"
		,to : "TEST9"
	});
	edges.push({
		from : "A2"
		,to : "TEST10"
	});
	edges.push({
		from : "A3"
		,to : "TEST1"
	});	
	edges.push({
		from : "A3"
		,to : "TEST6"
	});
	edges.push({
		from : "A3"
		,to : "TEST7"
	});
	edges.push({
		from : "A3"
		,to : "TEST8"
	});

	for ( var i=0, len=thing.length; i < len; i++ ){
		obj[thing[i]['id']] = thing[i];
	}
	for ( var key in obj ){
		nodes.push(obj[key]);
	}
	function createRelationChart() {
		var container = document.getElementById(chartDiv);
		var data = {
			nodes: nodes,
			edges: edges
		};
		var options = {
			nodes: {
				shape: 'dot',				
				scaling:{
					label: {
						min:15,
						max:50
				  	}
				}
			},
			groups: {
				 myGroup: {color:{background:'#F9BE4A'}, borderWidth:1}
				,"TEST1": {color:{background:'#6AE0BB'}, borderWidth:1}
				,"standard": {color:{background:'rgb(49, 191, 115)'}, borderWidth:1}
			}
		};
		network = new vis.Network(container, data, options);
	}
	createRelationChart();
}

function fnDrawGridChart(){
	arrSortChartData = arrChartData;
	
	arrSortChartData.sort(function (a, b) { 
		return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;  
	});
	
	var html = '<div style="overflow-y:auto;height:445px;padding:12px;">';
		html += '<table class="tbl-keyword">';
		html += '	<colgroup>';
		html += '		<col style="width:10%">';
		html += '		<col style="width:44%">';
		html += '		<col style="width:44%">';
		html += '	</colgroup>';
		html += '	<tbody id="grid-result">';	
		html += '		<tr>';
		html += '			<th class="tbl-keyword-header"><em class="orange-txt">Rank</th>';
		html += '			<td class="tbl-keyword-header">단어</td>';
		html += '			<td class="tbl-keyword-header">건수</td>';
		html += '		</tr>';		
		
		for(var i=0; i<arrChartData.length; i++){
			html += '		<tr class="arrSortGrid">';
			html += '			<th style="text-align:center;"><em class="orange-txt">'+arrChartData[i].rank+'</th>';
			html += '			<td style="text-align:center;">'+arrChartData[i].name+'</td>';
			html += '			<td style="text-align:center;">'+arrChartData[i].y+'</td>';
			html += '		</tr>';
		}
		
		html += '	</tbody>';
		html += '</table>';
		html += '</div>';

	$("#"+chartDiv).append(html);
}

function fnDrawBubbleChart(){
	Highcharts.setOptions({
		lang:{
			thousandsSep:','
		}
	});
	Highcharts.getOptions().colors = arrChartColor;
	var chart = new Highcharts.Chart({
		chart:{
			renderTo : chartDiv,  
			type: 'bubble',
	        plotBorderWidth: 1,
	        backgroundColor:'#0e3d67',
	        zoomType: 'xy'	        
		},
	    title: {
	        text: ''
	    },
	    subtitle: {
	        text: ''
	    },
	    xAxis: {
	       categories: "",
	       labels: {
		       style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
	        }	   
	    },
	    yAxis: {
	        title: {
	            text: ''
	        },
			labels : {
				alrign:"right"
				,style : {
					fontSize : "10px",
					fontFamily : "Verdana , sans-serif",
				    color:"#ffffff"
				}
			},	        
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    credits:{ 
	    	enabled:false 
	    },	    
	    tooltip: {
			backgroundColor:'rgba(0,0,0,0.85)',
			style:{
				color:"#F0F0F0",
				font:"10px Malgun Gothic"
			},
	        headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
	        pointFormat: '<tr><td style="padding:0">x:<b>{point.x}</b>, y:<b>{point.y}</b>, z:<b>{point.z}</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    legend: {
	    	enabled:false  
	    },
	    plotOptions: {
	        series: {
	        	borderColor:undefined,
	            states : { 
		        	hover:{ //hover시 라인 굵기는 변화 없도록함
		        		lineWidthPlus:0
		        	}
	        	},
	        	cursor: 'pointer',
	            marker: {
		            states : {
						hover : {
							enabled : true
						}
					}	
	            },dataLabels: {
					enabled: true,
					distance : -15,
					style:{
						"color":"#F0F0F0",
						"textShadow":"0px",
						"font":"10px Malgun Gothic"
					}
	            }
	        }
	    },	    
	    series: [{
	        data: [
	            { x: 95, y: 95, z: 13.8, name: '가'},
	            { x: 86.5, y: 102.9, z: 14.7, name: '나'},
	            { x: 80.8, y: 91.5, z: 15.8, name: '다'},
	            { x: 80.4, y: 102.5, z: 12, name: '라'},
	            { x: 80.3, y: 86.1, z: 11.8, name: '마'},
	            { x: 78.4, y: 70.1, z: 16.6, name: '바'},
	            { x: 74.2, y: 68.5, z: 14.5, name: '사'},
	            { x: 73.5, y: 83.1, z: 10, name: '아'},
	            { x: 71, y: 93.2, z: 24.7, name: '자'},
	            { x: 69.2, y: 57.6, z: 10.4, name: '차'},
	            { x: 68.6, y: 20, z: 16, name: '카'},
	            { x: 65.5, y: 126.4, z: 35.3, name: '타'},
	            { x: 65.4, y: 50.8, z: 28.5, name: '파'},
	            { x: 63.4, y: 51.8, z: 15.4, name: '하'}
	        ]
	    }]
	});			
}
</script>
<title>짜트온</title>
</head>
<body id="main-frame" style="background:#0a2c48 url(/zzharton/page/image/dashboard/common/bg_body.png) repeat-x">
<jsp:include page="/menu.jsp"></jsp:include>
	<div id="main-bottom">
		<div id="main-body" style="background:#0a2c48 url(/zzharton/page/image/dashboard/common/bg_body.png) repeat-x; border:0px;">
			<div class="module-top" style="height:30px;width:99%;">
				<span id="btn-back">
					<a><label style="font-size:12px; color:#ffffff; font-weight:bold;">뒤로가기</label></a>
				</span>							
			</div>
			<div class="module-wrap" style="height:520px; width:98%; border:0px;">
				<div class="width-oneThird" style="padding:10px 0px 10px 0px; height:480px;width:34%;">
					<div class="btn-row">
						<span class="dash-width-half btn-dashboard oneData" id="btn-word-chart" chart-type="tagcloud">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/tagcloud.png"></a>
						</span>
						<span class="dash-width-half btn-dashboard oneData" id="btn-bar-chart" chart-type="bar">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/bar.svg"></a>
						</span>
						<span class="dash-width-half btn-dashboard oneData" id="btn-pie-chart" chart-type="pie">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/pie.svg"></a>
						</span>					
					</div>
					<div class="btn-row">
						<span class="dash-width-half btn-dashboard oneData" id="btn-line-chart" chart-type="line">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/line.svg"></a>
						</span>	
						<span class="dash-width-half btn-dashboard oneData" id="btn-grid-chart" chart-type="grid">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/grid.png"></a>
						</span>							
						<span class="dash-width-half btn-dashboard twoData" id="btn-barLine-chart" chart-type="bar-line">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/bar-line.png"></a>
						</span>								
					</div>
					<div class="btn-row">
						<span class="dash-width-half btn-dashboard twoData" id="btn-twoLine-chart" chart-type="two-line">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/two-line.png"></a>
						</span>
						<span class="dash-width-half btn-dashboard etcData" id="btn-relation-chart" chart-type="relation">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/relation.png"></a>
						</span>
						<span class="dash-width-half btn-dashboard etcData" id="btn-bubble-chart" chart-type="bubble">
							<a><img class="btn-img-dashboard" src="/zzharton/page/image/dashboard/bubble.png"></a>
						</span>									
					</div>					
				</div>
				<div class="width-twoThird" style="padding:10px 0px 10px 0px; width:65%;">
					<div id="div-chart-area" style="height:480px;vertical-align:middle;text-align:center;/* border:1px solid #eeeeee */">
						<div id="div-warning-msg" style="line-height:476px;;vertical-align:middle;text-align:center;background:#eeeeee;border-radius:7px;">
							<img src="/zzharton/page/image/common/img-warning.png" style="width:25px; height:25px;">
							<label style="font-size:20px; font-weight:bold;margin-left :10px;">차트를 선택해주세요.</label>
						</div>
					</div>
				</div>				
			</div>
		</div>
	</div>
</body>
</html>
