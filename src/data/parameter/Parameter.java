package data.parameter;

import java.io.Serializable;
import java.util.Map;

import org.apache.tomcat.jni.FileInfo;


/**
 * @author 김나래
 *
 */
public interface Parameter extends Serializable {
	
	/**
	 * getValue 단축 메소드
	 * @param key
	 * @return string value
	 */
	String get(String key);
	
	/**
	 * <pre>
	 * 키에대한 파라미터 Boolean 값을 가져온다.
	 * 값이 null 이면 false 를 반환한다.
	 * 값이 String type 일 경우 대소문자 구분없이 
	 * 'y', 't', 'true', 'yes' 인 경우 true 를 반환한다.
	 * 값이 배열이고 length = 0 이면 false 를 반환한다.
	 * 값이 배열이고 length > 0 이면 첫번째 element 의 Boolean 값을 반환한다.
	 * </pre>
	 * @param key
	 * @return the boolean value in this property list with the specified key value.
	 */
	boolean getBoolean(String key);
	
	/**
	 * <pre>
	 * 키에대한 파라미터 integer 값을 가져온다.
	 * 값이 null 이면 -1을 반환한다.
	 * 값이 배열이고 length = 0 이면 -1을 반환한다.
	 * 값이 배열이고 length > 0 이면 첫번째 element 의 integer 값을 반환한다.
	 * </pre>
	 * @param key
	 * @return the integer value in this property list with the specified key value.
	 */
	int getInt(String key);
	
	/**
	 * <pre>
	 * 키에대한 파라미터 String 값을 가져온다.
	 * 값이 null 이면 empty string("")을 반환한다.
	 * 값이 배열이고 length = 0 이면 empty string("")을 반환한다.
	 * 값이 배열이고 length > 0 이면 첫번째 element 의 값을 반환한다.
	 * </pre>
	 * @param key
	 * @return the string value in this property list with the specified key value.
	 */
	String getValue(String key);
	
	/**
	 * <pre>
	 * 특정 키의 파라미터 String 배열 값을 가져온다.
	 * 값이 null 이면 null 이 아닌 길이가 0인 string 배열을 반환한다.
	 * 값이 배열이 아닌 객체이면 길이가 1인 string 배열을 반환한다.
	 * </pre>
	 * @param key
	 * @return the string value as array in this property list with the specified key value.
	 */
	String[] getValues(String key);
	
	/**
	 * <pre>
	 * 키에대한 파라미터 값을 가져온다.
	 * 값이 null 이면 null 을 반환한다.
	 * 값이 배열이고 length = 0 이면 null 을 반환한다.
	 * 값이 배열이고 length > 0 이면 첫번째 element 의 값을 반환한다.
	 * </pre>
	 * @param <T>
	 * @param key
	 * @return the <T> object value in this property list with the specified key value.
	 */
	<T> T getParameter(String key);
	
	
	/**
	 * <pre>
	 * 특정 키의 파라미터 배열 값을 가져온다.
	 * 값이 null 이면 null 이 아닌 길이가 0인 Object 배열을 반환한다.
	 * 값이 배열이 아닌 객체이면 길이가 1인 Object 배열을 반환한다.
	 * </pre>
	 * @param key
	 * @return the value object as array in this property list with the specified key value.
	 */
	Object[] getParameters(String key);
	
	/**
	 * <pre>
	 * 특정 키의 파라미터 값이 존재 하는지 조사한다.
	 * 값이 null 이면 false
	 * 값이 empty string("") 이면 false
	 * 그외에 true
	 * </pre>
	 * @param key
	 * @return true when value is null or empty string("")
	 */
	boolean isEmpty(String key);
	
	/**
	 * 특정 키의 파라미터 String 값을 설정한다.
	 * @param key
	 * @param value
	 * @return this
	 */
	Parameter set(String key, Object value);
	
	/**
	 * 특정 키의 파라미터 String 값을 설정한다.
	 * @param key
	 * @param value
	 * @return this
	 */
	Parameter setParameter(String key, Object value);
	
	/**
	 * 특정 키의 정보를 삭제한다.
	 * @param key
	 * @return removed object
	 */
	Object remove(String key);
	
	/**
	 * 파라미터 맵을 가져온다.
	 * @return Map
	 */
	Map<String, Object> asMap();
	
	/**
	 * 파라미터 맵을 가져온다.
	 * @return Map
	 */
	<T> Map<String, T> asRequestedMap();
	
	/**
	 * 파라미터 맵을 설정한다.
	 * @param map
	 */
	void initializeByMap(Map<String, Object> map);
	
	/**
	 * 파라미터에 해당 키가 존재여부를 조사한다.
	 * @return true when this has the key
	 */
	boolean hasKey(String key);
	
	/**
	 * 파라미터 키의 배열을 가져온다.
	 * @return the array of this key strings. if there is no key, return not null but 0 length array.
	 */
	String[] getKeys();
	
	/**
	 * 파일정보를 담고있는 리스트를 추가한다.
	 * @param fileInfo
	 */
	void addFileInfo(FileInfo fileInfo);
	
	/**
	 * 파일정보를 담고 있는 리스트를 가져온다.
	 * @return the array of file informations. if there is no file information, return not null but 0 length array.
	 */
	FileInfo[] getFileInfos();
	
	/**
	 * 복사본 파라미터 객체를 생성한다.
	 * @return parameter copied from this
	 */
	Parameter copy();

	/**
	 * 설정된 DB컬럼 데이터의 항목을 암호화 처리한다.
	 * @return parameter encrypt.
	 */
	Parameter encrypt();
}