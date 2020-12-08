package elastic.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.gson.JsonElement;

import elastic.controller.DocController;

public class ElasticUtil {

	public String setQuery(JSONObject jsonObj) {
		String query = "";
		
		JSONObject queryJson = new JSONObject();
		JSONObject boolJson = new JSONObject();
		JSONObject mustJson = new JSONObject();
		
		JSONArray mustJsonArr = new JSONArray();
		JSONArray mustNotJsonArr = new JSONArray();
		
		JSONObject matchJson;
		JSONObject matchSubJson;
		
		
		//일자
		if(jsonObj.get("srhDate") != null) {
			String dtDate = jsonObj.get("srhDate").toString();
			
			if("".equals(dtDate)) {
				matchJson = new JSONObject();
				matchSubJson = new JSONObject();
				
				JSONObject dateJson = new JSONObject();
				
				dateJson.put("gte", dtDate);
				dateJson.put("lte", dtDate);
				
				matchSubJson.put("date", dateJson);
				matchJson.put("range", matchSubJson);
				
				mustJsonArr.add(matchJson);
			}
		}
		
		//수집채널
		if(jsonObj.get("collectCode") != null) {
			String collectCode = jsonObj.get("collectCode").toString();
			
			if("".equals(collectCode)) {
				matchJson = new JSONObject();
				matchSubJson = new JSONObject();
				
				JSONObject dateJson = new JSONObject();
				
				
				matchSubJson.put("collect", collectCode+"*");
				matchJson.put("wildcard", matchSubJson);
				
				mustJsonArr.add(matchJson);
			}
		}

		
		//작성자
		if(jsonObj.get("writer") != null) {
			String writer = jsonObj.get("writer").toString();
			
			if(!"".equals(writer)) {
				matchJson = new JSONObject();
				matchSubJson = new JSONObject();
				
				JSONObject dateJson = new JSONObject();
				
				
				matchSubJson.put("writer", writer+"*");
				matchJson.put("wildcard", matchSubJson);
				
				mustJsonArr.add(matchJson);
			}
		}
		
		//키워드
		if(jsonObj.get("srhKeywordType") != null && jsonObj.get("srhKeyowrd") != null) {
			String tpKeyword = jsonObj.get("srhKeywordType").toString();
			String strKeyword = jsonObj.get("srhKeyowrd").toString();
			String[] keywordArr = strKeyword.split(",");
			if(!"".equals(tpKeyword)) {
				matchJson = new JSONObject();
				matchSubJson = new JSONObject();
				
				if("AND".equals(tpKeyword)) {
					if(keywordArr.length > 0) {
						for(int i=0; i<keywordArr.length; i++) {
							String keyword = keywordArr[i].trim();
							if(!"".equals(keyword)) {
								matchSubJson.put("contents", keyword);
								matchJson.put("match", matchSubJson);
								mustJsonArr.add(matchJson);
							}
						}
					}else {
						matchSubJson.put("contents", strKeyword.trim());
						matchJson.put("match", matchSubJson);
						mustJsonArr.add(matchJson);
					}
					
				}else if("OR".equals(tpKeyword)) {
					if(keywordArr.length > 1) {
						JSONObject boolObj = new JSONObject();
						JSONObject shouldObj = new JSONObject();
						JSONArray shouldArr = new JSONArray();
						
						for(int i=0; i<keywordArr.length; i++) {
							JSONObject termObj = new JSONObject();
							JSONObject termSubObj = new JSONObject();
							
							String keyword = keywordArr[i].trim();
							if(!"".equals(keyword)) {
								termSubObj.put("contents", keyword);
								termObj.put("match", termSubObj);
								shouldArr.add(termObj);
							}
							
							shouldObj.put("should", shouldArr);
							boolObj.put("bool", shouldObj);
						}
					}else {
						matchSubJson.put("contents", strKeyword.trim());
						matchJson.put("match", matchSubJson);
						mustJsonArr.add(matchJson);
					}
				}else {
					matchSubJson.put("contents", strKeyword.trim());
					matchJson.put("match", matchSubJson);
					mustJsonArr.add(matchJson);
				}
			}
		}
		
		if(mustJsonArr.size() > 0) {
			mustJson.put("must", mustJsonArr);
		}
		
		//제외 키워드
		if(jsonObj.get("notKeyowrd") != null) {
			String notKeyowrd = jsonObj.get("notKeyowrd").toString();
			if(!"".equals(notKeyowrd)) {
				matchJson = new JSONObject();
				matchSubJson = new JSONObject();
				
				matchSubJson.put("contents", notKeyowrd);
				matchJson.put("match", matchSubJson);
				mustNotJsonArr.add(matchJson);
				mustJson.put("must_not", mustNotJsonArr);
			}
		}
		
		
		boolJson.put("bool", mustJson);
		
	//	JSONObject mustJson = new JSONObject();		
	//	JSONArray mustJsonArr = new JSONArray();
		
		
		//정렬
		JSONArray sortJsonArr = new JSONArray();
		JSONObject sortJson = new JSONObject();
		
		sortJson.put("date", "desc");
		sortJsonArr.add(sortJson);
		
		//그룹
		
		
		JSONParser parser = new JSONParser();
		JSONObject countJsonObj = new JSONObject();
		
		String countJsonStr = "{\"group_by_state\":{\"terms\":{\"field\":\"date\"},\"aggs\":{\"date_count\":{\"value_count\":{\"field\":\"date\"}}}}}";
		try {
			countJsonObj = (JSONObject) parser.parse(countJsonStr);
		} catch (ParseException e) {
			
		}
		
		queryJson.put("query", boolJson);
		queryJson.put("sort", sortJsonArr);
		queryJson.put("aggs", countJsonObj);
	//	queryJson.put("from", 0);
	//	queryJson.put("size", 10000);
		
		query = queryJson.toJSONString();
		
		return query;

	}
	
	public JSONObject setResultStrToJSONObject(String result) {
		JSONParser parser = new JSONParser();
		
		JSONObject jsonObj = new JSONObject();
		try {
			jsonObj = (JSONObject) parser.parse(result);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return jsonObj;
	}	

	public String setResult(JSONObject resultObj) {
		JSONObject hitsObj = (JSONObject) resultObj.get("hits");
		JSONArray hitsArr = (JSONArray) hitsObj.get("hits");
		
		JSONArray resultArr = new JSONArray();
		JSONObject infoObj = new JSONObject();

		JSONObject totalObj =  (JSONObject) hitsObj.get("total");
		System.out.println(totalObj);
		
		infoObj.put("totalCount", totalObj.get("value"));
		infoObj.put("indexName", "doc");
		resultArr.add(infoObj);
		for(int i=0; i<hitsArr.size(); i++){ 
			JSONObject result = (JSONObject) hitsArr.get(i);
			resultArr.add((JSONObject) result.get("_source"));
		}
		//첫번째 result Arr에는 정보를 넣는다.
		System.out.println(resultArr.toJSONString());
		return resultArr.toJSONString();
	}

	public static void main(String[] args) {
		JSONObject searchObj = new JSONObject();
		searchObj.put("srhKeywordType", "OR");
		searchObj.put("srhKeyowrd", "문서");
//		searchObj.put("notKeyowrd", "");
//		searchObj.put("collectCode", "KBS");
		searchObj.put("srhDate", "2020-11-05");
//		searchObj.put("writer", "KBS");
		
		
		ElasticUtil util = new ElasticUtil();		
		String query = util.setQuery(searchObj);
		
		DocController docController = new DocController();
		String result = docController.getSearchDocument(query);
		JSONObject resultObj = util.setResultStrToJSONObject(result);
		String resultData = util.setResult(resultObj);
		
		
	}

}
