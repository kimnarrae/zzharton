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

import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;


public class DocController {
	private static final Log logger = LogFactory.getLog(DocController.class);
	
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
			Request request = new Request("POST","testdoc/_search/");
			
			request.setJsonEntity(query);
			Response response = restClient.performRequest(request);
			
			if(response.getStatusLine().getStatusCode() == 200) {
				result = EntityUtils.toString(response.getEntity());
			}else {
				logger.debug(response.getStatusLine().getStatusCode()+ " ");
			}
			
			restClient.close();
			
		} catch (Exception e) {
			logger.debug(e.getMessage());
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
				logger.debug("dataObj : "+dataObj.toJSONString());
				String key = dataObj.get("key").toString();
				String path = "testdoc/_doc/"+key;
				
				logger.debug("date => "+dataObj.get("date").toString());
				
				Request request = new Request("POST",path);
				
				String query = dataObj.toJSONString();
				logger.debug("query => "+query);
				if(!"".equals(query)) {
					request.setJsonEntity(query);
				}			
				
				Response response = restClient.performRequest(request);
				
				if(response.getStatusLine().getStatusCode() == 200) {
					result = EntityUtils.toString(response.getEntity());
					logger.debug("result => "+result);
					resultArr.add(result);
				}else {
					logger.debug(response.getStatusLine().getStatusCode() + " ");
				}				
			}
			restClient.close();
			
		} catch (Exception e) {
			logger.debug(e.getMessage());
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
			logger.debug("dataObj => "+dataObj);
				String key = dataObj.get("key").toString();
				String path = "testdoc/_doc/"+key;
				
				Request request = new Request("POST",path);
				
				String query = dataObj.toJSONString();
				logger.debug("query => "+query);
				if(!"".equals(query)) {
					request.setJsonEntity(query);
				}			
				
				Response response = restClient.performRequest(request);
				
				if(response.getStatusLine().getStatusCode() == 200) {
					result = EntityUtils.toString(response.getEntity());
					resultArr.add(result);
				}else {
					logger.debug(response.getStatusLine().getStatusCode() + " ");
				}				
			restClient.close();
			
		} catch (Exception e) {
			logger.debug(e.getMessage());
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
