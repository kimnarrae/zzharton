package upload;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class FileReaderMain {

	public static void main(String[] args) {
		BufferedReader br = null;
		FileInputStream fileInputStream = null;
        
        Workbook wb;
		String inTxt;
		
		String isDir = "C:\\Users\\김나래\\Desktop\\과제\\실무프로젝트\\";
		String fileName = "form_upload_data.xlsx";
		
		try {
			fileInputStream = new FileInputStream(new File(isDir+fileName));
			
			File[] infoFile = new File(isDir).listFiles();
	
			//wb = new HSSFWorkbook(fileInputStream); // Excel 2007 이전 버전
			wb = new XSSFWorkbook(fileInputStream); // Excel 2007 이상

	        Sheet sheet = wb.getSheetAt(0);               
	        int endRowIdx = sheet.getLastRowNum();
	        Map<Integer,String> resultMap = new HashMap();
	        
			for(int idx=1; idx<endRowIdx; idx++) {
				StringBuilder sb = new StringBuilder();
				Row row = sheet.getRow(idx);
							
				String data = checkCellData(row,0).trim();
				String data2 = checkCellData(row,1).trim();
				
				String cnt = checkCellData(row,2).trim();
				
				if("".equals(data) || "".equals(data2) || "".equals(cnt)) {
					
				}else {
					sb.append(data + "|" + data2 + "|" + cnt);
					resultMap.put(idx, sb.toString());
				}
			}
			System.out.println(resultMap);
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 
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
				cell.setCellType( XSSFCell.CELL_TYPE_STRING );
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

}
