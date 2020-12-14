package elastic.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
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
import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import elastic.service.ElasticUtil;

/**
 * Servlet implementation class GetDocumentServlet
 */
@WebServlet("/KeywordDownload")
public class KeywordExcelDownload extends HttpServlet {
	
	String keywordContents;
	
	private static final Log logger = LogFactory.getLog(KeywordExcelDownload.class);
	private static final long serialVersionUID = 1L;
     
	DocController docController;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public KeywordExcelDownload() {
        super();
        docController = new DocController();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		
		Enumeration<String> values = request.getParameterNames();
        while(values.hasMoreElements()){
            String param = values.nextElement();
            System.out.println("2 : "+param+"/"+request.getParameter(param));
        }
		
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
        
	   	 // 엑셀 파일 하나를 만듭니다
	  	  Workbook workbook = new SXSSFWorkbook();
	  	  // 엑셀 파일 내부에 Sheet 를 하나 생성합니다 (엑셀 파일 하나에는 여러 Sheet가 있을 수 있습니다)
	  	  Sheet sheet = workbook.createSheet();
	  	  String result = "{\"종영\":2,\"정작\":1,\"안전성\":1,\"유행하\":1,\"숨지자\":1,\"보류하기\":1,\"사례\":3,\"무료\":1,\"29일\":2,\"사망자\":1,\"앵커\":1,\"접종인원\":1,\"보류할\":1,\"하자\":1,\"운데\":1,\"조사\":1,\"확보\":1,\"지속하\":1,\"전체\":1,\"위해서\":1,\"리포트\":1,\"사망의\":1,\"의료기관\":1,\"대구경북\":1,\"중단하기\":1,\"접종했지\":1,\"질병관리청\":2,\"사흘\":1,\"하더라\":1,\"예방\":4,\"코나19\":1,\"현장\":1,\"22일\":1,\"자치단체\":2,\"낮아\":1,\"긴급\":1,\"아닌지\":1,\"성구\":1,\"26\":1,\"커지\":3,\"대구시\":3,\"7천\":1,\"대한\":3,\"트윈\":1,\"접종의\":1,\"정경\":1,\"지금\":1,\"나오니까\":1,\"19일\":1,\"질병관리청장\":1,\"않았\":1,\"권하\":1,\"매우\":1,\"줄었\":1,\"3백\":1,\"의원\":1,\"넘게\":1,\"대해\":2,\"8천\":1,\"꺼리\":1,\"의사회장\":1,\"권했\":1,\"함께\":1,\"회원들게\":1,\"우려\":1,\"하지\":3,\"접종자\":1,\"기자\":1,\"계속하겠다\":1,\"대구경북지역의\":1,\"청군\":1,\"동네\":1,\"밝혔\":1,\"하루\":1,\"접종\":12,\"인플루엔자\":1,\"계속하기\":1,\"일부\":2,\"검토한\":1,\"데믹\":1,\"실제\":1,\"인성\":1,\"뉴스\":1,\"닷새\":1,\"김천시\":1,\"사망\":3,\"않았다\":1,\"독감백신\":1,\"26건\":1,\"필요하\":1,\"한명\":1,\"맞지\":1,\"26일부터\":1,\"사흘간\":1,\"접종후\":1,\"직접적인\":1,\"의사회\":2,\"분석한\":1,\"겁니다\":1,\"취지\":1,\"지난\":1,\"없다\":1,\"좀더\":1,\"포항시\":1,\"포함해\":1,\"걱정\":1,\"갈수록\":1,\"불안\":1,\"백신\":5,\"대구의\":1,\"없었\":1,\"상당히\":1,\"확인되지\":1,\"여기\":1,\"연관성\":2,\"KBS\":1,\"혼란\":2,\"엇박자\":1,\"공지했\":1,\"아직\":1,\"해야하\":1,\"그런\":1,\"신서동\":1,\"중단\":3,\"어제\":1,\"전국\":2,\"40여\":1,\"보류\":1,\"변희환\":1,\"일시\":1,\"독감\":8,\"다음\":1,\"산발적\":1}";
	  	  JSONObject jsonObj = new JSONObject();
	  	  
	  	  JSONParser parser = new JSONParser();
	  	  try {
	  		  jsonObj = (JSONObject) parser.parse(keywordContents);
	  	  } catch (ParseException e) {
	  		  logger.debug(e.getMessage());
			  }
	  	  
	  	  // 헤더를 생성합니다
	  	  int rowIndex = 0;
	  	  Row headerRow = sheet.createRow(rowIndex++);
	  	  Cell headerCell1 = headerRow.createCell(0);
	  	  headerCell1.setCellValue("데이터 x");
	  	  
	  	  Cell headerCell2 = headerRow.createCell(1);
	  	  headerCell2.setCellValue("건수");
	  	  
	  	  Iterator iter = jsonObj.keySet().iterator();
	  	  while(iter.hasNext()){
	  		  String key = (String) iter.next();
	  		  String value = String.valueOf(jsonObj.get(key));
			   	  Row bodyRow = sheet.createRow(rowIndex++);
		
		    	  Cell bodyCell1 = bodyRow.createCell(0);
		    	  bodyCell1.setCellValue(key);
		
		    	  Cell bodyCell2 = bodyRow.createCell(1);
		    	  bodyCell2.setCellValue(value);
	  	  }
	  	response.setHeader("Content-Disposition", "attachment; filename=yyy.xls"); 
        response.setHeader("Content-Description", "JSP Generated Data"); 
        response.setContentType("application/vnd.ms-excel");
        
    	  try {
  			File xlsFile = new File("C:\\Users\\82108\\Downloads\\"+System.currentTimeMillis()+".xls");  
  			FileOutputStream fileOut = new FileOutputStream(xlsFile);
  			workbook.write(fileOut);
  		} catch (FileNotFoundException e) {
  			logger.error(e.getMessage());
  		} catch (IOException e) {
  			logger.error(e.getMessage());
  		}     
        
  	  	workbook.write(response.getOutputStream());
  	  	workbook.close();
  	  	

			/*
			 * response.setContentType("text/html; charset=utf-8");
			 * response.getWriter().append("SUCCESS:엑셀 다운로드에 성공하였습니다.");
			 */
	}

	private void processFormField(FileItem item) throws Exception{
        String name = item.getFieldName(); //필드명 얻기
        String value = item.getString("UTF-8"); //UTF-8형식으로 필드에 대한 값읽기
        
        if("keywordContents".equals(name)) {
        	keywordContents = value;
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
