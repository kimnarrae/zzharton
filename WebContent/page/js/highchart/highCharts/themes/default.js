/**
 * Grid theme for Highcharts JS
 * @author Torstein Hønsi
 */

Highcharts.theme = {
   colors :["#FECB79","#B88A8B","#D57C6B","#95BBE4","#8FBC95"],
   chart: {
      borderRadius: 0
   },
   credits: {
       enabled: false
   },
   exporting: {
       enabled: false
   },
   title: {
      style: {
         font: 'bold 12px "Trebuchet MS", NanumGothic, sans-serif'
      }
   },
   subtitle: {
      style: {
         color: '#8c8c8c',
         font: 'bold 11px "Trebuchet MS", NanumGothic, sans-serif'
      }
   },
   xAxis: {
	  gridLineWidth: -1,
	  gridLineColor: '#EAEAEA',
	  lineWidth: 1,
      labels : {
         	style : {
         		color : '#9E9E9E',
         		font : '8pt',
         		fontWeight : 'bold'
         	}
      },
      title: {
         style: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: '12px',
            fontFamily: 'Trebuchet MS, NanumGothic, sans-serif'

         }
      }
   },
   yAxis: {
	  enabled: false,
      gridLineWidth: 1,
      lineWidth: -1,
      tickColor: '#000',
      labels: {
          enabled: false
      },
      stackLabels : {
            enabled : true
          , style : {
              		  fontWeight : 'bold'
              		, color : 'gray'
          		   } 
          }
      , title: {
    	  		style: {
			        	text: '',
			            margin: 0,
			            color: '#333',
			            fontWeight: 'bold',
			            fontSize: '12px',
			            fontFamily: 'Trebuchet MS, NanumGothic, sans-serif'
    	  			   }
      			}
   		}
      , legend: {
    	  		floating: false,
    	  		layout: 'horizontal',
    	  		borderRadius:0,
		        borderWidth:0,
		        backgroundColor: '#EFEFEF',
		        padding : 2,
	            itemMarginTop: 0,
	            itemMarginBottom: 0,
		        itemStyle: {
				         font: '8pt Trebuchet MS, NanumGothic, sans-serif',
				         color: 'black',
				         lineHeight: '5px'

			    }
      	}
      , labels : {
		      	style : {
		    		color : '#5F5F5F',
		    		font : '8pt'
		    	}
		    }
      , navigation: {
				      buttonOptions: {
				         theme: {
				            stroke: '#CCCCCC'
				         }
				      }
      }
};

