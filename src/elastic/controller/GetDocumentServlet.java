package elastic.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import elastic.service.ElasticUtil;

/**
 * Servlet implementation class GetDocumentServlet
 */
@WebServlet("/GetDocument")
public class GetDocumentServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetDocumentServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
//		JSONObject jsonObj = new JSONObject();
//		jsonObj.put("srhKeywordType", "OR");
//		jsonObj.put("srhKeyowrd", "코로나");
//		jsonObj.put("notKeyowrd", "");
//		jsonObj.put("collectCode", "KBS");
//		jsonObj.put("srhDate", "2020-01-01");
//		jsonObj.put("writer", "KBS");
		
		JSONObject jsonObj = new JSONObject();
//		jsonObj.put("srhKeywordType", "OR");
//		jsonObj.put("srhKeyowrd", "문서");
//		jsonObj.put("notKeyowrd", "");
//		jsonObj.put("collectCode", "KBS");
//		jsonObj.put("srhDate", "2020-11-05");
//		jsonObj.put("writer", "KBS");
		
		ElasticUtil util = new ElasticUtil();		
		String query = util.setQuery(jsonObj);
		
		DocController docController = new DocController();
		String result = docController.getSearchDocument(query);
		
		JSONObject resultObj = util.setResultStrToJSONObject(result);
		String resultData = util.setResult(resultObj);
		
		
		response.setContentType("text/html; charset=utf-8");
		response.getWriter().append(resultData);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
