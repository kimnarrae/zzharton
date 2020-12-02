package elastic.controller;

import org.apache.http.HttpHost;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
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
	
	public static void main(String[] args) {
		String urlPath = "localhost:9200/doc/_search";
		String query = "";
		String body = "";
		
		String ip = "localhost";
		Integer port = 9200;
		String schema = "http";
		try {
			//URL url = new URL(urlPath);
			RestClient restClient = RestClient.builder(new HttpHost(ip,port,schema)).build();
			Request request = new Request("POST","doc/_search/");
		//	request.setJsonEntity(query);
			Response response = restClient.performRequest(request);
			
			if(response.getStatusLine().getStatusCode() == 200) {
				body = EntityUtils.toString(response.getEntity());
			}else {
				System.out.println(response.getStatusLine().getStatusCode());
			}
			
			restClient.close();
			System.out.println(body);
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
