package elastic.controller;

import org.apache.http.HttpHost;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

public class DocController {
	private RestTemplate restTemplate = null;
	private HttpComponentsClientHttpRequestFactory factory = null;
	
	public DocController(){
		this.factory = new HttpComponentsClientHttpRequestFactory();
		factory.setReadTimeout(10000);
		factory.setConnectTimeout(10000);
		factory.setConnectionRequestTimeout(10000);
		
		RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(7000).setSocketTimeout(15000).build();
		
		CloseableHttpClient httpClient = HttpClientBuilder.create().setMaxConnPerRoute(1024).setMaxConnTotal(2048).setDefaultRequestConfig(requestConfig).build();
		this.factory.setHttpClient(httpClient);
		this.restTemplate = new RestTemplate(factory);
	}
	
	public String getSearchDocument(String query) {
		String result = "";
		
		String ip = "localhost";
		Integer port = 9200;
		String schema = "http";
		try {
			//URL url = new URL(urlPath);
			RestClient restClient = RestClient.builder(new HttpHost(ip,port,schema)).build();
			Request request = new Request("POST","doc/_search/");
			if(!"".equals(query)) {
				request.setJsonEntity(query);
			}			
			Response response = restClient.performRequest(request);
			
			if(response.getStatusLine().getStatusCode() == 200) {
				result = EntityUtils.toString(response.getEntity());
			}else {
				System.out.println(response.getStatusLine().getStatusCode());
			}
			
			restClient.close();
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return result;
	}
	
	public String insertDocument(JSONArray dataArr) {
		String result = "";
		
		JSONArray resultArr = new JSONArray();
		
		String ip = "localhost";
		Integer port = 9200;
		String schema = "http";
		try {
			//URL url = new URL(urlPath);
			RestClient restClient = RestClient.builder(new HttpHost(ip,port,schema)).build();

			for(int i=0; i<dataArr.size(); i++) {				
				JSONObject dataObj = (JSONObject) dataArr.get(i);
				System.out.println(dataObj);
				String key = dataObj.get("key").toString();
				String path = "doc/_doc/"+key;
				
				System.out.println(dataObj.get("date").toString());
				
				Request request = new Request("POST",path);
				
				String query = dataObj.toJSONString();
				System.out.println(query);
				if(!"".equals(query)) {
					request.setJsonEntity(query);
				}			
				
				Response response = restClient.performRequest(request);
				
				if(response.getStatusLine().getStatusCode() == 200) {
					result = EntityUtils.toString(response.getEntity());
					System.out.println(result);
					resultArr.add(result);
				}else {
					System.out.println(response.getStatusLine().getStatusCode());
				}				
			}
			restClient.close();
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return resultArr.toJSONString();
	}
	
	public String insertDocument(JSONObject dataObj) {
		String result = "";
		
		JSONArray resultArr = new JSONArray();
		
		String ip = "localhost";
		Integer port = 9200;
		String schema = "http";
		try {
			//URL url = new URL(urlPath);
			RestClient restClient = RestClient.builder(new HttpHost(ip,port,schema)).build();
				System.out.println(dataObj);
				String key = dataObj.get("key").toString();
				String path = "doc/_doc/"+key;
				
				Request request = new Request("POST",path);
				
				String query = dataObj.toJSONString();
				System.out.println(query);
				if(!"".equals(query)) {
					request.setJsonEntity(query);
				}			
				
				Response response = restClient.performRequest(request);
				
				if(response.getStatusLine().getStatusCode() == 200) {
					result = EntityUtils.toString(response.getEntity());
					resultArr.add(result);
				}else {
					System.out.println(response.getStatusLine().getStatusCode());
				}				
			restClient.close();
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return resultArr.toJSONString();
	}	
	
	public static void main(String[] args) {
		String query = "{\"size\":1000,\"query\":{\"bool\":{\"must\":[{\"wildcard\":{\"writer\":\"KBS*\"}},{\"match\":{\"contents\":\"코로나\"}}]}},\"from\":0,\"sort\":[{\"date\":\"desc\"}],\"aggs\":{\"group_by_state\":{\"terms\":{\"field\":\"date\"},\"aggs\":{\"date_count\":{\"value_count\":{\"field\":\"date\"}}}}}}";
		DocController docController = new DocController();
		String result = docController.getSearchDocument(query);
		System.out.println(result);
	}
}
