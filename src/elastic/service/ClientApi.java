package elastic.service;

import java.util.logging.LogManager;
import java.util.logging.Logger;

import org.elasticsearch.client.RestHighLevelClient;

public class ClientApi {
//
//	Logger log = LogManager.getLogger();
//	
//	private String hostname = "localhost";
//	private int port = 9200;
//	private String scheme = "http";
//		
//	protected RestHighLevelClient client;
//	
//	public ClientApi() {
//		init();
//	}
//	public ClientApi(String hostname) {
//		this.hostname = hostname;
//		init();
//	}
//	public ClientApi(String hostname, int port) {
//		this.hostname = hostname;
//		this.port = port;
//		init();
//	}
//	public ClientApi(String hostname, int port, String scheme) {
//		this.hostname = hostname;
//		this.port = port;
//		this.scheme = scheme;
//		init();
//	}
//	private void init() {
//		log.info("conntect to " + hostname +":"+port + " / " + scheme);
//		client = ClientFactory.createClient(hostname, port, scheme);
//		log.info("conntected..");
//	}
//	
//	
//	/**
//	 * Indices API 관련 클래스를 반환
//	 * @return
//	 */
//	public IndexApi getIndexApi() {
//		return new IndexApi(client);
//	}
//
//	/**
//	 * Document API 관련 클래스를 반환
//	 * @return
//	 */
//	public DocumentApi getDocumentApi() {
//		return new DocumentApi(client);
//	}
//	
//	/**
//	 * Search API 관련 클래스를 반환
//	 * @return
//	 */
//	public SearchApi getSearchApi() {
//		return new SearchApi(client);
//	}
//	
//	/**
//	 * 연결 종료
//	 */
//	public void close() {
//		try {
//			client.close();
//			log.info("connection closed..");
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//	}
}
