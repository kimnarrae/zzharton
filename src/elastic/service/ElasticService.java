package elastic.service;

import java.io.IOException;

import org.elasticsearch.common.xcontent.XContentFactory;

public class ElasticService {
	//https://joyhong.tistory.com/107
	//public void createDocument1() throws IOException { ClientApi api = new ClientApi(ip); DocumentApi docApi = api.getDocumentApi(); XContentBuilder indexBuilder = XContentFactory.jsonBuilder() .startObject() .field("code", "2021") .field("title", "나니아 연대기") .field("date", new Date()) .endObject(); docApi.createDocument("test", "_doc", "1", indexBuilder); indexBuilder = XContentFactory.jsonBuilder() .startObject() .field("code", "2022") .field("title", "Walk to Remember") .field("date", new Date()) .endObject(); docApi.createDocument("test", "_doc", "2", indexBuilder); api.close(); }
}
