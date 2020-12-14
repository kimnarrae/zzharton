package elastic.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import edu.emory.mathcs.backport.java.util.Arrays;

public class ElasticService {
	String delWordStr = "이,가,께서,에서,을,를,에,로,보다,으로써,와,고,라고,와,과,랑,하고,며,이며,이랑,에,에다,은,는,만,도,마저,까지,조차";
	String[] delWord = delWordStr.split(",");
	
	public static void main(String[] args) {
		/*
		 * String str = "사람은 "; System.out.println(str.replace("은 ",""));
		 */
		  String contents = "국내 코로나19 신규 확진자가 오늘(29일) 0시를 기준으로 38명을 기록해 수도권 2차 유행 이후 처음으로 50명 미만을 기록했습니다. 민족 대명절 추석을 앞두고 안도할 만한 소식입니다. 하지만 이럴 때일수록 긴장을 늦춰서는 곤란합니다. 방역 당국도 아직은 안심할 단계는 아니라고 선을 그었습니다.\r\n"
		  		+ "\r\n"
		  		+ "아직 전국적으로 산발적인 집단 감염을 이어지고 있고, 이번 추석 대규모 인원이 전국적으로 이동하면서 올가을 코로나 19가 다시 유행할 수도 있기 때문입니다.\r\n"
		  		+ "\r\n"
		  		+ "더구나 코로나19 완치 이후에도 대다수가 후유증을 호소하고 있다는 방역 당국의 발표는 우리가 왜 지금 이 순간 더 방역수칙을 철저히 지켜야 하는지를 상기시킵니다.\r\n"
		  		+ "■ 코로나19 완치자 중 90% 이상이 후유증 호소\r\n"
		  		+ "\r\n"
		  		+ "중앙방역대책본부는 오늘 열린 정례브리핑에서 \"코로나19에 걸렸다가 완치된 뒤 겪는 후유증을 조사한 결과, 완치자 중 90% 이상이 피로감과 집중력 저하 등의 후유증을 겪는 것으로 나타났다\"고 밝혔습니다.\r\n"
		  		+ "\r\n"
		  		+ "권준욱 중앙방역대책본부 부본부장은 \"경북대병원의 경우 전체 5,762명의 대상자에 대해 코로나19 완치 후 후유증에 대한 답변을 구해, 그중 참여자 965명이 응답했다\"며, \"그중 91.1%에 해당하는 879명의 완치자가 최소 1개 이상의 후유증이 있다고 답변했다\"고 말했습니다.\r\n"
		  		+ "\r\n"
		  		+ "대표적인 완치 후 후유증으로는 피로감(26.2%), 집중력 저하(24.6%)을 비롯해 심리적·정신적 후유증, 후각·미각 손실 등도 나타난 것으로 조사됐습니다. 완치 후에도 일상생활에서 어려움이 계속되고 있는 겁니다.\r\n"
		  		+ "\r\n"
		  		+ "권 부본부장은 \"코로나19 확진 후 회복된 분들에 대해서는 내년 중 폐에 대한 CT 촬영 및 분석 등을 통해 합병증을 확인하고, 일일이 혈액 검체도 확보해 좀 더 세밀한 분석을 할 계획\"이라고 덧붙였습니다.\r\n"
		  		+ "■ 코로나19 완치자 가운데 호흡 장애 호소하기도….\r\n"
		  		+ "\r\n"
		  		+ "이처럼 코로나19 완치 이후 후유증을 호소하는 경우는 비단 우리나라 완치자만이 아닙니다. 이달 초 미국 워싱턴 포스트는 이탈리아 북부 롬바르디아주 베르가모 의료진의 연구 사례를 통해 완치자 가운데 거의 절반이 호흡 장애를 비롯한 심각하고 다양한 후유증에 시달리고 있다는 조사 결과를 기사화한 바 있습니다.\r\n"
		  		+ "\r\n"
		  		+ "해당 기사에서 베르가모 지역의 의료진은 코로나19에 감염됐다 회복된 사람들을 대상으로 혈액, 심장, 폐 등에 대한 검사와 함께 건강 상태에 대한 심층 조사를 진행했는데 코로나로부터 완치됐다고 느끼느냐는 질문에 거의 절반이 아니라고 답했다고 말했습니다.\r\n"
		  		+ "\r\n"
		  		+ "의료진은 또 지금까지 조사한 750명의 코로나19 회복자 가운데 약 30%는 폐에 상흔과 이로 인한 호흡 장애를 겪고 있다고 전했습니다. 또 다른 30%는 심장이상이나 동맥경화 등과 연결된 염증이나 혈액 응고 등을 앓고 있고 일부는 신장 기능 장애의 위험을 안고 있는 것으로 알려졌습니다.\r\n"
		  		+ "\r\n"
		  		+ "그런가 하면 영국의 일간지 더 선도 인터넷판을 통해 신종 코로나바이러스 감염증에서 회복된 후에도 호흡곤란과 인지기능 저하, 고열, 설사, 환각과 불면증 등 최대 16가지의 후유증이 나타날 수 있다고 보도한 바 있습니다. 또, 코로나19를 극복한 사람 중에는 회복 후 몇 달이 지나도 감염 전에 하던 일을 다시 하지 못하고 후유증에 시달리는 사람들이 적지 않다고 설명했습니다.\r\n"
		  		+ "\r\n"
		  		+ "코로나19는 지금껏 우리가 겪어보지 못한 확산세로 우리 삶 속으로 파고들고 있습니다. 게다가 아직 우리는 이 신종 전염병이 우리 몸에 어디까지 피해를 주는지 또 완치 이후에도 어떤 후유증을 남기는지 명확하게 파악하지 못하고 있는 게 현실입니다.\r\n"
		  		+ "\r\n"
		  		+ "코로나19 발병시 완치도 어려운데 어떤 후유증이 우리 몸속에 남을지 모른다는 게 우리를 더욱 두렵게 합니다. 결국, 사회적 거리 두기와 마스크 착용 등 방역수칙을 잘 따름으로써 코로나19로부터 우리 스스로 자신을 지키는 수밖에 없습니다.\r\n"
		  		+ "\r\n"
		  		+ "닷새간의 추석 연휴, 여유를 즐기며 하고 싶은 것도 많을 테지만 나 자신과 가족의 안전을 위해 좀 더 집에서 시간을 보내는 건 어떨까요.\r\n"
		  		+ "";
		  String analContents = keywordStringReplace(contents.replaceAll("\r\n", "")).trim();
		  String[] contentsArr = analContents.split(" ");
		  
		  if(contentsArr.length > 0) { 
			  for (String str : contentsArr) {
				  if(!"".equals(str)) {
					  if("".equals(str.replaceAll("[0-9]",""))) {
						  continue;
					  }
					  
					  String chgStr = str + " ";
					  List<String> strList = ElasticUtil.getKoreanPostpositions();
					  
					  for(String dStr :strList){
						  chgStr = chgStr.replaceAll(dStr+" ", "");
					  }
					  
					  if(chgStr.trim().length() > 1) {
						  System.out.println(str + " ==> "+chgStr);
					  }
				  }
			  }
		  }
	}
	
	public static String keywordStringReplace(String str){
        String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
        str = str.replaceAll(match, " ");
        str = str.replaceAll("입니다", " ").replaceAll("됐습니다", " ").replaceAll("올라섰습니다"," ").replaceAll("습니다", " ");
        
        return str;
	}
}
