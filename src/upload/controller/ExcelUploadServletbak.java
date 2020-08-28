package upload.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import upload.service.ExcelUploadService;
import upload.vo.ExcelUploadVo;

/*@WebServlet("/zzharton/fUpload")*/
@WebServlet(name="fUpload",urlPatterns={"/zzharton/fUpload"})
public class ExcelUploadServletbak extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Resource
	private ExcelUploadService uploadService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExcelUploadServletbak() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html; charset=utf-8");
		String filePath = request.getParameter("filePath");
		
		try {
			System.out.println("===="+filePath);
			
			List<ExcelUploadVo> result = uploadService.getExcelData(filePath);
			
			System.out.println("===============");
			System.out.println(result);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
