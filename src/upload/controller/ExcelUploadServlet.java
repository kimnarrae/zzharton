package upload.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import upload.service.ExcelUploadService;
import upload.vo.ExcelUploadVo;

/**
 * Servlet implementation class ExcelUploadServlet
 */
@WebServlet("/fUpload")
public class ExcelUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static String dataType = "";
	
	/* file Info */
    private static long fileSize = 0;
	private static String fileName = "";
	private static String filePath = "";
	private static String contentType = "";
	private static String name = "";
	
	private static boolean fgData = true;
	
	private static JSONObject resultObj = new JSONObject();
	       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExcelUploadServlet() {
        super();

    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

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
                } else { 
                	//파일인 경우
                    processUploadFile(item, contextRootPath);
                }             
            }           
        } catch(Exception e) {
        	String errorMsg = e.getLocalizedMessage();
        	response.getWriter().append("ERROR:"+errorMsg);
        	return;
        }
        
        getExcelData();
        
        // result data를 만든다.
        response.setContentType("text/html; charset=utf-8");
        if(fileName == null || fileName == "") {
        	response.getWriter().append("ERROR:FILE 이름이 없습니다.");
        	return;
        }else {
        	if(!fgData) {
            	response.getWriter().append("ERROR:EXCEL DATA가 없습니다.");
            	return;        		
        	}else {
                resultObj.put("name", name);
                resultObj.put("fileName", fileName);
                resultObj.put("contentType", contentType);
                resultObj.put("fileSize", fileSize);
                resultObj.put("filePath", filePath);
                
                System.out.println(resultObj.get("resultData"));
                response.getWriter().append(resultObj.toJSONString());
        	}
        }
    }

    private void getExcelData() {
    	String excelData = "";
    	
    	if(filePath == null || dataType == "") {
			filePath = "C:\\Users\\김나래\\Desktop\\과제\\실무프로젝트\\form_upload_data3.xlsx";
		}
		
		if(dataType == null || dataType == "") {
			dataType = "oneData";
		}

        if("oneData".equals(dataType)) {
        	excelData = ExcelUploadService.getExcelDataOne(filePath);	
		}else if("twoData".equals(dataType)){
			excelData = ExcelUploadService.getExcelDataTwo(filePath);	
		}
        
        if(excelData.length() > 0) {
            resultObj.put("resultData", excelData);
            
            System.out.println("dataType ==="+dataType);
            System.out.println(excelData);
        }else {
        	fgData = false;
        }
	}

	//업로드한 정보가 파일인경우 처리
    private void processUploadFile(FileItem item, String contextRootPath) throws Exception {
        name = item.getFieldName(); //파일의 필드 이름 얻기
        fileName = item.getName(); //파일명 얻기
        fileSize = item.getSize(); //파일의 크기 얻기
        
        //업로드 파일명을 현재시간으로 변경후 저장
        String fileExt = fileName.substring(fileName.lastIndexOf("."));
        String uploadedFileName = System.currentTimeMillis() + fileExt; 
        
        //저장할 절대 경로로 파일 객체 생성
        File uploadedFile = new File(contextRootPath + "/upload/" + uploadedFileName);
        item.write(uploadedFile); //파일 저장
       
        filePath = uploadedFile.getPath();
    }
    
    private void processFormField(FileItem item) throws Exception{
        String name = item.getFieldName(); //필드명 얻기
        String value = item.getString("UTF-8"); //UTF-8형식으로 필드에 대한 값읽기
        
        if("dataType".equals(name)) {
        	dataType = value;
        }        
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
