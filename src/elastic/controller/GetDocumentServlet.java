package elastic.controller;

import java.io.File;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
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
    JSONObject jsonObj = new JSONObject();
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		
//		Enumeration<String> values = request.getParameterNames();
//        while(values.hasMoreElements()){
//            String param = values.nextElement();
//            System.out.println("2 : "+param+"/"+request.getParameter(param));
//        }
		
        try {            
            //디스크상의 프로젝트 실제 경로얻기
            String contextRootPath = this.getServletContext().getRealPath("/"); 
            //1. 메모리나 파일로 업로드 파일 보관하는 FileItem의 Factory 설정
            DiskFileItemFactory diskFactory = new DiskFileItemFactory(); //디스크 파일 아이템 공장
            diskFactory.setSizeThreshold(4096); //업로드시 사용할 임시 메모리
            diskFactory.setRepository(new File(contextRootPath + "/WEB-INF/temp")); //임시저장폴더
            
            //2. 업로드 요청을 처리하는 ServletFileUpload생성
            ServletFileUpload upload = new ServletFileUpload(diskFactory);
            upload.setSizeMax(3 * 1024 * 1024); //3MB : 전체 최대 업로드 파일 크기
            
            @SuppressWarnings("unchecked")
            //3. 업로드 요청파싱해서 FileItem 목록구함​​
            List<FileItem> items = upload.parseRequest(request); 
            
            Iterator<FileItem> iter = items.iterator(); //반복자(Iterator)로 받기​            
            while(iter.hasNext()) { //반목문으로 처리​    
                FileItem item = (FileItem) iter.next(); //아이템 얻기
                 //4. FileItem이 폼 입력 항목인지 여부에 따라 알맞은 처리
                if(item.isFormField()){ 
                	//파일이 아닌경우
                    processFormField(item);
                }            
            }           
        } catch(Exception e) {
        	String errorMsg = e.getLocalizedMessage();
        	response.getWriter().append("ERROR:"+errorMsg);
        	return;
        }		        
        
        
        System.out.println(jsonObj.toJSONString());
		ElasticUtil util = new ElasticUtil();		
		//String query = util.setQuery(jsonObj);
		String query = "";
		
		DocController docController = new DocController();
		String result = docController.getSearchDocument(query);
		System.out.println(result);
		
		JSONObject resultObj = util.setResultStrToJSONObject(result);
		String resultData = util.setResult(resultObj);
		
		
		response.setContentType("text/html; charset=utf-8");
		response.getWriter().append(resultData);
	}
	
    private void processFormField(FileItem item) throws Exception{
        String name = item.getFieldName(); //필드명 얻기
        String value = item.getString("UTF-8"); //UTF-8형식으로 필드에 대한 값읽기
        
        if("srhKeywordType".equals(name)) {
        	if(!"".equals(value)) {
        		jsonObj.put("srhKeywordType", value);
        	}        	
        }
        if("srhKeyword".equals(name)) {
        	if(!"".equals(value)) {
        		jsonObj.put("srhKeyword", value);
        	}
        }
        if("srhNotKeyword".equals(name)) {
        	if(!"".equals(value)) {
        		jsonObj.put("srhNotKeyword", value);
        	}
        }
        if("dtDate".equals(name)) {
        	if(!"".equals(value)) {
        		jsonObj.put("dtDate", value);
        	}
        }
        if("writer".equals(name)) {
        	if(!"".equals(value)) {
        		jsonObj.put("writer", value);
        	}   
        }
        if("collectCode".equals(name)) {
        	if(!"".equals(value)) {
        		jsonObj.put("collectCode", value);
        	}
        }
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");        
		doGet(request, response);
		
	}

}
