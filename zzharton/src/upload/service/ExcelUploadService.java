package upload.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.activation.MimetypesFileTypeMap;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.apache.commons.io.FilenameUtils;

import upload.vo.ExcelUploadVo;

public class ExcelUploadService {

	static FileInputStream fis = null;		
	static Workbook wb = null;
	static FilenameUtils fu = new FilenameUtils();

	public ExcelUploadService(){}
	
	public static List<ExcelUploadVo> getExcelData(String filePath) {
		String fileType = checkFileType(filePath);
		
		try {
			fis = new FileInputStream(new File(filePath));
			if("xls".equals(fileType)) {
				wb = new HSSFWorkbook(fis); // Excel 2007 이전 버전
			}else if("xlsx".equals(fileType)){
				wb = new XSSFWorkbook(fis); // Excel 2007 이상
			}else {
				return null;
			}
			
	        Sheet sheet = wb.getSheetAt(0);               
	        int endRowIdx = sheet.getLastRowNum();
	        List<ExcelUploadVo> resultList = new ArrayList<>();
	        
			for(int idx=1; idx<endRowIdx; idx++) {
				ExcelUploadVo uploadVo = new ExcelUploadVo();
				Row row = sheet.getRow(idx);
							
				String data = checkCellData(row,0).trim();
				String cnt = checkCellData(row,1).trim();
				
				System.out.println(data + " / "+cnt);				
				
				if("".equals(data) || "".equals(cnt)) {
					continue;
				}else {
					uploadVo.setRN(idx);
					uploadVo.setDATA(data);
					uploadVo.setCOUNT(cnt);
					
					resultList.add(uploadVo);
				}
			}
			System.out.println(resultList.toString());
			
			return resultList;
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 		
		
		return null;
	}

	public static String getExcelDataOne(String filePath) {
		String fileType = checkFileType(filePath);
		
		try {
			fis = new FileInputStream(new File(filePath));
			
			if("xls".equals(fileType)) {
				wb = new HSSFWorkbook(fis); // Excel 2007 이전 버전
			}else if("xlsx".equals(fileType)){
				wb = new XSSFWorkbook(fis); // Excel 2007 이상
			}else {
				return null;
			}
			
	        Sheet sheet = wb.getSheetAt(0);               
	        int endRowIdx = sheet.getLastRowNum();
	        
	        JSONObject resultObj = new JSONObject();
			JSONArray dataArray = new JSONArray();
			JSONArray cntArray = new JSONArray();
			JSONArray rankArray = new JSONArray();
	        
			for(int idx=1; idx<endRowIdx; idx++) {
				Row row = sheet.getRow(idx);
				// 1. ONE :  키워드 | 건수
				// 2. TWO : 기준 키워드 | 기준 건수 | 대상 키워드 | 대상 건수
							
				String data = checkCellData(row,0).trim();
				String strCnt = checkCellData(row,1).trim();
				
				if("".equals(data) || "".equals(strCnt)) {
					continue;
				}else {
					Integer cnt = Integer.parseInt(strCnt);
					
					dataArray.add(data);
					cntArray.add(cnt);
					rankArray.add(1);
				}
			}
			resultObj.put("keyword", dataArray);
			resultObj.put("count", cntArray);

	        for(int i=0; i<cntArray.size(); i++){
	        	rankArray.set(i, 1); //1등으로 초기화
	            for (int j=0; j < cntArray.size(); j++) { //기준데이터와 나머지데이터비교                             
	                if(Integer.parseInt(cntArray.get(i).toString()) < Integer.parseInt(cntArray.get(j).toString())){   //기준데이터가 나머지데이터라 비교했을때 적으면 rank[i] 카운트
	                	Integer intRank = Integer.parseInt(rankArray.get(i).toString())+1;
	                	rankArray.set(i, intRank);
	                }              
	            }          
	        }
	        
	        resultObj.put("rank", rankArray);
	       
			return resultObj.toJSONString();			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 		
		
		return null;
	}
	
/*	public static String getExcelDataTwo(String filePath) {
		String fileType = checkFileType(filePath);
		
		try {
			fis = new FileInputStream(new File(filePath));
			
			if("xls".equals(fileType)) {
				wb = new HSSFWorkbook(fis); // Excel 2007 이전 버전
			}else if("xlsx".equals(fileType)){
				wb = new XSSFWorkbook(fis); // Excel 2007 이상
			}else {
				return null;
			}
			
	        Sheet sheet = wb.getSheetAt(0);               
	        int endRowIdx = sheet.getLastRowNum();
	        
	        JSONObject mainResultObj = new JSONObject();
	        
	        JSONArray resultArray = new JSONArray();	        
	        JSONObject firstObj = new JSONObject();
	        JSONObject secondObj = new JSONObject();
	        
	        JSONArray standardArray = new JSONArray();	        
			JSONArray dataArray = new JSONArray();
			JSONArray cntArray = new JSONArray();
			JSONArray data2Array = new JSONArray();
			JSONArray cnt2Array = new JSONArray();
	        
			for(int idx=1; idx<endRowIdx; idx++) {
				ExcelUploadVo uploadVo = new ExcelUploadVo();
				Row row = sheet.getRow(idx);
				
				// 2. TWO : 기준 |기준 키워드 | 기준 건수 | 대상 키워드 | 대상 건수
				
				String standardWord = checkCellData(row,0).trim();			
				String keyword = checkCellData(row,1).trim();
				String strCnt = checkCellData(row,2).trim();
				String keyword2 = checkCellData(row,3).trim();
				String strCnt2 = checkCellData(row,4).trim();
				
				System.out.println(standardWord + "/"+keyword+"/"+strCnt+"/"+keyword2+"/"+strCnt2);
							
				
				if("".equals(keyword) || "".equals(strCnt) || "".equals(keyword2) || "".equals(strCnt2)) {
					continue;
				}else {
					Integer cnt = Integer.parseInt(strCnt);
					Integer cnt2 = Integer.parseInt(strCnt2);
					
					standardArray.add(standardWord);
					dataArray.add(keyword);
					data2Array.add(keyword2);
					
					cntArray.add(cnt);					
					cnt2Array.add(cnt2);
				}
			}
			
			
			
			firstObj.put("name", dataArray);
			firstObj.put("data", cntArray);
			
			secondObj.put("name", data2Array);
			secondObj.put("data", cnt2Array);
			
			resultArray.add(firstObj);
			resultArray.add(secondObj);
			
			mainResultObj.put("name", standardArray);

			mainResultObj.put("data", resultArray);
			
			return mainResultObj.toJSONString();
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 		
		
		return null;
	}	*/

	public static String getExcelDataTwo(String filePath) {
		String fileType = checkFileType(filePath);
		
		try {
			fis = new FileInputStream(new File(filePath));
			
			if("xls".equals(fileType)) {
				wb = new HSSFWorkbook(fis); // Excel 2007 이전 버전
			}else if("xlsx".equals(fileType)){
				wb = new XSSFWorkbook(fis); // Excel 2007 이상
			}else {
				return null;
			}
			
	        Sheet sheet = wb.getSheetAt(0);               
	        int endRowIdx = sheet.getLastRowNum();
	        
	        JSONObject mainResultObj = new JSONObject();
	        
	        JSONArray resultArray = new JSONArray();	        
	        JSONObject firstObj = new JSONObject();
	        JSONObject secondObj = new JSONObject();
	        
	        JSONArray standardArray = new JSONArray();
	        JSONArray firstArray = new JSONArray();
	        JSONArray secondArray = new JSONArray();
						
			
			Row firstRow = sheet.getRow(0);
			
			String firstName = checkCellData(firstRow,1).trim();
			String secondName = checkCellData(firstRow,2).trim();
	        
			for(int idx=1; idx<endRowIdx; idx++) {
				Row row = sheet.getRow(idx);
				
				// 2. TWO : 기준  |기준1 건수 | 기준2 건수
				
				String standardWord = checkCellData(row,0).trim();			
				String strCount = checkCellData(row,1).trim();
				String strCount2 = checkCellData(row,2).trim();
				
				System.out.println(standardWord + "/"+strCount+"/"+strCount2);
							
				
				if("".equals(standardWord) ||"".equals(strCount) || "".equals(strCount2) ) {
					continue;
				}else {
					Integer cnt = Integer.parseInt(strCount);
					Integer cnt2 = Integer.parseInt(strCount2);
					
					standardArray.add(standardWord);
					
					firstArray.add(cnt);
					secondArray.add(cnt2);
				}
			}
			
			firstObj.put("name", firstName);
			firstObj.put("data", firstArray);
			
			secondObj.put("name", secondName);
			secondObj.put("data", secondArray);
			
			resultArray.add(firstObj);
			resultArray.add(secondObj);
			
			mainResultObj.put("name", standardArray);
			mainResultObj.put("data", resultArray);
			
			
			System.out.println(firstObj);
			System.out.println(secondObj);
			System.out.println(resultArray);
			System.out.println("=========================");
			System.out.println(mainResultObj.toJSONString());
			
			return mainResultObj.toJSONString();
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 		
		
		return null;
	}	
		
	public static String checkFileType(String filePath) {
		File file = new File(filePath);
		String fileName = FilenameUtils.getBaseName(filePath);
		String fileType = FilenameUtils.getExtension(filePath);
		return fileType;
	}
	
	private static  String checkCellData(Row row, Integer typeCell) {
		String result = null;
		if(typeCell == null) {
			return result;
		}		
		
		Cell cell = row.getCell(typeCell);		
		String value = "";
		
		switch(cell.getCellType()){
			case XSSFCell.CELL_TYPE_FORMULA:
				value = cell.getCellFormula();
				break;
			case XSSFCell.CELL_TYPE_NUMERIC:
				// 숫자일 경우, String형으로 변경하여 값을 읽는다.
				cell.setCellType( cell.CELL_TYPE_STRING );
				value = cell.getStringCellValue();
				break;
			case XSSFCell.CELL_TYPE_STRING:
				value = cell.getStringCellValue();
				break;
			case XSSFCell.CELL_TYPE_BLANK:
				//value = cell.getBooleanCellValue()+"";
				value = " ";
				break;
			case XSSFCell.CELL_TYPE_ERROR:
				value = cell.getErrorCellValue()+"";
				break;
		}		
		result = value;
		
		return result;
	}
	
	public static String getExcelDataEtc(String filePath) {
		return "";
	}
}
