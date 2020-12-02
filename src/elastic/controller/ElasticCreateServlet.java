package elastic.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpHost;
import org.elasticsearch.action.DocWriteRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.TimeValue;

/**
 * Servlet implementation class ElasticSearchCreateServlet
 */
@WebServlet("/ElasticPutServlet")
public class ElasticCreateServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ElasticCreateServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 request.setCharacterEncoding("UTF-8");
		 
	        try( RestHighLevelClient client = new RestHighLevelClient(
	                RestClient.builder(
	                        new HttpHost("localhost",9200,"http")
	                )
	        )){

	        	String query = "PUT doc\r\n"
	        			+ "{\r\n"
	        			+ "  \"settings\": {\r\n"
	        			+ "    \"number_of_shards\":   5,\r\n"
	        			+ "    \"number_of_replicas\": 2,\r\n"
	        			+ "    \"max_result_window\" : 1000\r\n"
	        			+ "  },\r\n"
	        			+ "  \"mappings\": {\r\n"
	        			+ "    \"properties\": {\r\n"
	        			+ "      \"key\":{ \"type\": \"keyword\" },\r\n"
	        			+ "      \"collect\":{ \"type\": \"keyword\" },\r\n"
	        			+ "      \"user\":{ \"type\": \"keyword\" },\r\n"
	        			+ "      \"contents\" :  { \"type\": \"text\" },\r\n"
	        			+ "      \"dt_data_reg\":  { \"type\": \"date\", \"format\": \"yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis\"},\r\n"
	        			+ "    }\r\n"
	        			+ "  }\r\n"
	        			+ "}";

	        }catch(Exception e){
	            e.printStackTrace();
	        }


			/*
			 * Map<String, Object> jsonMap = new HashMap<>(); jsonMap.put("user", "김용수");
			 * jsonMap.put("date", new Date()); jsonMap.put("message", "김용수는 위고에 다닌다");
			 * IndexRequest request = new IndexRequest("posts") .id("1").source(jsonMap);
			 * request.routing("routing"); request.timeout(TimeValue.timeValueSeconds(1));
			 * request.opType(DocWriteRequest.OpType.CREATE); request.opType("create");
			 */
	}
	
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
