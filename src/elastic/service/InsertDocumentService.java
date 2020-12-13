package elastic.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import elastic.controller.DocController;

public class InsertDocumentService {
	static FileInputStream fis = null;		
	static Workbook wb = null;
	static FilenameUtils fu = new FilenameUtils();
	
	public InsertDocumentService(){}

	public static String insertElasticDoc(String filePath) {
		String fileType = ElasticUtil.checkFileType(filePath);
		
		String result = "";
		
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
	        
	        JSONObject dataObj = new JSONObject();
			JSONArray dataArr = new JSONArray();
	        
			for(int idx=1; idx<endRowIdx; idx++) {
				Row row = sheet.getRow(idx);	
				String key = checkCellData(row,0).trim();
				String collect = checkCellData(row,1).trim();
				String writer = checkCellData(row,2).trim();
				String title = checkCellData(row,3).trim();
				String contents = checkCellData(row,4).trim();
				String dtDate = checkCellData(row,5).trim();
				
				if(!"".equals(key) && !"".equals(contents)) {
					String keywordContents = getKeywordJson(contents);
					
					dataObj.put("key", key);
					dataObj.put("collect", collect);
					dataObj.put("writer", writer);
					dataObj.put("title", title);
					dataObj.put("contents", contents);
					dataObj.put("date", dtDate);
					dataObj.put("keyword_contents", keywordContents);
					
					DocController dc = new DocController();
					dc.insertDocument(dataObj);
				}	
			}
//			
//			if(dataArr.size() > 0) {
//				DocController dc = new DocController();
//				dc.insertDocument(dataArr);
//			}else {
//				result = "ERROR:NO DATA";
//			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			result = "ERROR:"+e.getMessage();
		} catch (IOException e) {
			e.printStackTrace();
			result = "ERROR:"+e.getMessage();
		} 		
		return result;	
	}
	
	private static String getKeywordJson(String contents) {
		List<String> keywordList = keywordContents(contents);
		Map<String,Integer> map = new HashMap<>();
		
		if(keywordList.size() > 0) {
			for(int i=0; i<keywordList.size(); i++) {
				String key = keywordList.get(i);
				if(!"".equals(key) && key.length() > 1) {
					if(map.containsKey(key)) {
						map.put(key,map.get(key)+1);
					}else {
						map.put(key, 1);
					}
				}
			}
		}
		JSONObject keywordJson = new JSONObject(map);
		System.out.println(keywordJson.toJSONString());
		return keywordJson.toJSONString();
	}
	
	private static List<String> keywordContents(String contents) {
		  String analContents = contentsStringReplace(contents.replaceAll("\r\n", "")).trim();
		  String[] contentsArr = analContents.split(" ");
		  
		  List<String> keywordList = new ArrayList<>();
		  
		  if(contentsArr.length > 0) { 
			  for (String str : contentsArr) {
				  if(!"".equals(str)) {
					  if("".equals(str.replaceAll("[0-9]",""))) {
						  continue;
					  }
					  
					  String chgStr = str + " ";
					  List<String> strList = ElasticUtil.getKoreanPostpositions();

					  for(String dStr :strList){
						  chgStr = replaceLast(chgStr,dStr,"").trim();
					  }
					  if(chgStr.length() > 1 && !"".equals(chgStr)) {
						  keywordList.add(chgStr);
					  }
				  }
			  }
		  }
		  return keywordList;
	}
	private static String replaceLast(String string, String toReplace, String replacement) {
		int pos = string.lastIndexOf(toReplace);
		if (pos > -1) {
			return string.substring(0, pos)+ replacement + string.substring(pos +   toReplace.length(), string.length());
		} else {
			return string;
		} 

	}

	
	private static String contentsStringReplace(String str){
        String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
        str = str.replaceAll(match, " ");
        str = str.replaceAll("입니다", " ").replaceAll("따르면", " ").replaceAll("됐습니다", " ").replaceAll("올라섰습니다"," ").replaceAll("습니다", " ");
        
        return str;
	}

	private static String checkCellData(Row row, Integer typeCell) {
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
	
	public static void main(String[] args) {
		String filePath = "D:\\workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\zzharton\\upload\\doc-1607782659789.xlsx";
		InsertDocumentService.insertElasticDoc(filePath);
	}
}
