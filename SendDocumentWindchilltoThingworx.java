package ext.document;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;

import wt.content.ApplicationData;
import wt.content.ContentHelper;
import wt.content.ContentRoleType;
import wt.content.ContentServerHelper;
import wt.content.FormatContentHolder;
import wt.doc.WTDocument;
import wt.fc.PersistenceHelper;
import wt.fc.QueryResult;
import wt.lifecycle.LifeCycleState;
import wt.pds.StatementSpec;
import wt.query.QueryException;
import wt.query.QuerySpec;
import wt.query.SearchCondition;
import wt.query.WhereExpression;

public class Workflow_FetchDocument {
	public static void fetchDocument(Object primaryBusinessObject) throws Exception {
  //Fetch from Workflow
	if(primaryBusinessObject instanceof WTDocument) {
		WTDocument document=(WTDocument)primaryBusinessObject;
		String docNumber=document.getNumber();
		File file=null;
		try {
			QuerySpec querySpec = new wt.query.QuerySpec(WTDocument.class);
			SearchCondition searchCondition=new SearchCondition(WTDocument.class, "master>number", SearchCondition.EQUAL, docNumber, true);
			querySpec.appendWhere((WhereExpression) searchCondition, new int[]{0});
			QueryResult queryResult = PersistenceHelper.manager.find((StatementSpec)querySpec);
			document = (WTDocument)queryResult.nextElement();
			WTDocument latDoc = (wt.doc.WTDocument)wt.vc.VersionControlHelper.service.allVersionsOf(document.getMaster()).nextElement();
			/*LifeCycleState lifecycleState= latDoc.getState();
			System.out.println("Document Name:-> "+latDoc.getName());
			System.out.println("Document Number:-> "+latDoc.getNumber());
			System.out.println("Document LifeCycle state:->  "+ lifecycleState.toString());
			System.out.println("Document Version:-> : "+latDoc.getVersionInfo().getIdentifier().getValue());
			System.out.println("Document Iteration:-> : "+latDoc.getIterationIdentifier().getValue());*/
			
			FormatContentHolder  formatContentHolder = (FormatContentHolder) ContentHelper.service.getContents(latDoc);
	        ContentRoleType primaryRoleType = ContentRoleType.toContentRoleType("PRIMARY");
	        QueryResult primaryContentResult = ContentHelper.service.getContentsByRole(formatContentHolder, primaryRoleType);
	        ApplicationData primaryData = (ApplicationData)primaryContentResult.nextElement();  
	      /*file=new File(primaryData.getFileName());
	        System.out.println("File Name:->"+file);*/
	        
	        InputStreamReader inputStreamReader = new InputStreamReader(ContentServerHelper.service.findContentStream(primaryData));
	        BufferedReader in = new BufferedReader(inputStreamReader);
	        StringBuilder responseStrBuilder = new StringBuilder();
		    String inputStr;
		    while ((inputStr = in.readLine()) != null) {
		        responseStrBuilder.append(inputStr);
		    }
			JSONObject jsonObject = new JSONObject(responseStrBuilder.toString());
			System.out.println("JSON OBject => "+jsonObject);
	
			String userName = "Administrator";
			String password ="thingworx";
			String userpass = userName + ":" + password;
			String basicAuth = new String(Base64.getEncoder().encode(userpass.getBytes()));
			String urlBasePath="http://bltsp01124:8092/Thingworx/Things/Fetch_Document/Services/Fetch_Doc_Service";
	        //Connect
			HttpURLConnection urlConnection = (HttpURLConnection) ((new URL(urlBasePath).openConnection()));
	        urlConnection.setDoOutput(true);
	        urlConnection.setRequestProperty("Content-Type", "application/json");
	        urlConnection.setRequestProperty("Authorization", "Basic "+basicAuth);
	        urlConnection.setRequestProperty("Accept", "application/json");
	        urlConnection.setRequestMethod("POST");
	        
	        urlConnection.setConnectTimeout(10000);
	        urlConnection.connect();
	        JSONObject obj = new JSONObject();
	        obj.put("Name",latDoc.getName());
	        obj.put("Number",latDoc.getNumber() );
	        obj.put("Version",latDoc.getVersionInfo().getIdentifier().getValue());
	        obj.put("Iteration",latDoc.getIterationIdentifier().getValue());
	        obj.put("WindchillModel", jsonObject);
	        String data = obj.toString();
	        OutputStream outputStream = urlConnection.getOutputStream();
	        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, "UTF-8"));
	        writer.write(data);
	        writer.close();
	        outputStream.close();
	        System.out.println("Status Code: -> "+urlConnection.getResponseCode());
	        InputStreamReader inputStreamReader1 = new InputStreamReader(urlConnection.getInputStream());
	        BufferedReader in1 = new BufferedReader(inputStreamReader1);
	        StringBuilder responseStrBuilder1 = new StringBuilder();
		    String inputStr1;
		    while ((inputStr1 = in1.readLine()) != null) {
		        responseStrBuilder1.append(inputStr1);
		    }
		    System.out.println("responseStrBuilder1 => "+responseStrBuilder1);
			JSONObject jsonObject1 = new JSONObject(responseStrBuilder1.toString());
			System.out.println("JSON OBject => "+jsonObject1);
			JSONArray rowArray = jsonObject1.getJSONArray("rows");			
			System.out.println("JSON rowArray => "+((JSONObject)rowArray.get(0)).get("result"));
	
	}catch (QueryException e) {
		System.out.println("Catch Execution");
		e.printStackTrace();
	}
}
}
}
