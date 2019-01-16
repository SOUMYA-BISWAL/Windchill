/**
 * Invokes InfoEngine task with the given parameters and returns collection of PTC.IE.Group entities.
 * 
 * @param data Data for processing action request
 * @param params Parameters required to invoke the InfoEngine task
 * @returns Collection of PTC.ECM.ChangeIssue entities
 */
 
// Import necessary Classes
var System = Java.type('java.lang.System');
var System = Java.type('java.lang.System');
var WTContainerRef = Java.type('wt.inf.container.WTContainerRef');
var WTContainerHelper = Java.type('wt.inf.container.WTContainerHelper');
var PersistenceHelper = Java.type('wt.fc.PersistenceHelper');
var ActionResult = Java.type("com.ptc.odata.core.entity.processor.ActionResult");
var WTReference = Java.type('wt.fc.WTReference');
var ReferenceFactory = Java.type('wt.fc.ReferenceFactory');
var File = Java.type('java.io.File');
var ApplicationData = Java.type('wt.content.ApplicationData');
var ContentRoleType = Java.type('wt.content.ContentRoleType');
var Transaction = Java.type('wt.pom.Transaction');
var ContentServerHelper = Java.type('wt.content.ContentServerHelper');
var WTDocument = Java.type('wt.doc.WTDocument');
var URL = Java.type('java.net.URL');
var HttpURLConnection = Java.type('java.net.HttpURLConnection');
var String = Java.type('java.lang.String');
var StringBuilder = Java.type('java.lang.StringBuilder');
var InputStreamReader = Java.type('java.io.InputStreamReader');
var BufferedReader = Java.type('java.io.BufferedReader');
var JSONObject = Java.type('org.json.JSONObject');
var FileWriter = Java.type('java.io.FileWriter');
var Base64 = Java.type('java.util.Base64');
var QuerySpec = Java.type('wt.query.QuerySpec');
var Integer = Java.type('java.lang.Integer');
var SearchCondition = Java.type('wt.query.SearchCondition');
var VersionControlHelper = Java.type('wt.vc.VersionControlHelper');
var ContentHelper = Java.type('wt.content.ContentHelper');
var WorkInProgressHelper = Java.type('wt.vc.wip.WorkInProgressHelper');



function action_createDocument(data, params) {
	
	
	
	var result = new ActionResult();
	var name = params.get('name').getValue();
	var description = params.get('description').getValue();
	var organisation = params.get('organisation').getValue();
	var product = params.get('product').getValue();
	var contentURL = params.get('ContentURL').getValue();
	
	var fName="0000056354";//contentURL.substring(contentURL.lastIndexOf('/')+1,contentURL.length());
	System.out.println("fName => "+fName);
	
	var querySpec = new QuerySpec(WTDocument.class);
	querySpec.appendWhere(
                    new SearchCondition(WTDocument.class, "master>number", SearchCondition.EQUAL, fName, false),[0,1]);
	var queryResult = PersistenceHelper.manager.find(querySpec);
	System.out.println("Query Reslut Sixe => "+queryResult.size());
	if(queryResult.size()>0) {
		queryDoc = queryResult.nextElement();
		//var latQueryDoc = VersionControlHelper.service.getLatestIteration(queryDoc,true);
		var latQueryDoc = VersionControlHelper.service.allVersionsOf(queryDoc.getMaster()).nextElement();
		var docname = latQueryDoc.getName();
		var docNumber = latQueryDoc.getNumber();
		var docState= latQueryDoc.getState();
		
		System.out.println("WTDocument Fetched with DocName as "+docname+", DocNumber as "+docNumber+" and State Value is => "+docState);
		System.out.println("Query getVersionInfo : "+latQueryDoc.getVersionInfo().getIdentifier().getValue());
		System.out.println("Query getIterationIdentifier : "+latQueryDoc.getIterationIdentifier().getValue());

		
		if(docState.toString().equals("INWORK")){
			
			var updatedDocument = updatePrimaryContent(latQueryDoc,contentURL);
			
			
		}
		else if(docState.toString().equals("RELEASED")){
			
			var updatedDocument = updatePrimaryContent(latQueryDoc,contentURL); //latQueryDoc
			
			updatedDocument = VersionControlHelper.service.newVersion(updatedDocument);
			updatedDocument = PersistenceHelper.manager.save(updatedDocument);
			updatedDocument = PersistenceHelper.manager.refresh(updatedDocument);
			System.out.println(" After Revise getVersionInfo : "+updatedDocument.getVersionInfo().getIdentifier().getValue());
			System.out.println(" After Revise getIterationIdentifier : "+updatedDocument.getIterationIdentifier().getValue());
				
			
		}
	} else{

	//---------------------------------------------------------Creation Code---------------
	
	var name = params.get('name').getValue();
	var description = params.get('description').getValue();
	var organisation = params.get('organisation').getValue();
	var product = params.get('product').getValue();
	var contentURL = params.get('ContentURL').getValue();
	
	System.out.println("PostMan Inputs : \nname : "+name+"description : "+description+"organisation : "+organisation+"product : "+product+" contentURL => "+contentURL);
	
	var containerPath = "/wt.inf.container.OrgContainer="+organisation+"/wt.pdmlink.PDMLinkProduct="+product;
	var containerRef = WTContainerHelper.service.getByPath(containerPath);
	var transaction = new Transaction();
	var result = new ActionResult();
	
	// New WTDOCUMENT Creation and Setting Attributes
	var doc = WTDocument.newWTDocument();
	doc.setName(name);
	doc.setContainerReference(containerRef);
	
	if(description!=null){
			doc.setDescription(description);
	}
	
	// Database Commit
	doc = PersistenceHelper.manager.store(doc);
	
	//Database Transaction
	transaction.start();
	
	var fileName=contentURL.substring(contentURL.lastIndexOf('/')+1,contentURL.length());
	System.out.println("fileName => "+fileName);
	
	var url = new URL(contentURL);
	var urlConnection = url.openConnection();
	var userName = "Administrator";
	var password ="thingworx";
	var userpass = userName + ":" + password;
	var basicAuth = "Basic " + new String(Base64.getEncoder().encode(userpass.getBytes()));
	urlConnection.setRequestProperty ("Authorization", basicAuth);
	var inputStreamReader = new InputStreamReader(urlConnection.getInputStream());
	var bufferedReader  = new BufferedReader(inputStreamReader);
	var responseStrBuilder = new StringBuilder();
	var line=null;
	while ((line = bufferedReader.readLine()) != null) {
		responseStrBuilder.append(line);
	}
	var jsonObject = new JSONObject(responseStrBuilder.toString());
	System.out.println("JSON OBject => "+jsonObject);
	file = new File("D:\\"+fileName);
	var writer = new FileWriter(file);
	writer.write(jsonObject.toJSONString());
	writer.close();
	
	// Primary Content Upload
	var docAD = ApplicationData.newApplicationData(doc);
	docAD.setFileName(file.getName());
	docAD.setUploadedFromPath("D:\\"+fileName);
	docAD.setRole(ContentRoleType.PRIMARY);
	var inputstream = new java.io.FileInputStream(file);
	ContentServerHelper.service.updateContent(doc, docAD,inputstream);
	transaction.commit();
	transaction=null;
	inputstream.close();
	*/
	// Returning new created ChangeIssue as action result
	updatedDocument = PersistenceHelper.manager.refresh(updatedDocument);
    var documentEntity = data.getProcessor().toEntity(updatedDocument, data);
    result.setReturnedObject(documentEntity);
    return result;
	
	}
}


function updatePrimaryContent(document,contentURL){
	
	System.out.println("Inside updatePrimaryContent Function");
	
	// CheckOut Document
	workingDocument = WorkInProgressHelper.service.checkout(document, WorkInProgressHelper.service.getCheckoutFolder(), "").getWorkingCopy();
	System.out.println("Document Checkout ");
	
	// Delete Existing Primary Content If ANY
	workingDocument = ContentHelper.service.getContents(workingDocument);
	var ci = workingDocument.getPrimary();
	System.out.println("workingDocument Primary ContentItem => "+ci);
	ContentServerHelper.service.deleteContent(workingDocument,ci);
	System.out.println(" workingDocument Primary Content Deleted");
	workingDocument = PersistenceHelper.manager.save(workingDocument);
	System.out.println(" workingDocument Primary Content Deleted and Saved");
	workingDocument = PersistenceHelper.manager.refresh(workingDocument);
	workingDocument = ContentHelper.service.getContents(workingDocument);
	var ci = workingDocument.getPrimary();
	System.out.println(" After Delete ContentItem from workingDocument => "+ci);
	
	// Fetching File Name fron URL
	var fileName=contentURL.substring(contentURL.lastIndexOf('/')+1,contentURL.length());
	System.out.println("fileName => "+fileName);
	
	//Database Transaction
	var transaction = new Transaction();
	transaction.start();
	
	// Connecting to ThingWorx Repository with basic Authentication.
	var url = new URL(contentURL);
	var urlConnection = url.openConnection();
	var userName = "Administrator";
	var password ="thingworx";
	var userpass = userName + ":" + password;
	var basicAuth = "Basic " + new String(Base64.getEncoder().encode(userpass.getBytes()));
	urlConnection.setRequestProperty ("Authorization", basicAuth);
	var inputStreamReader = new InputStreamReader(urlConnection.getInputStream());
	var bufferedReader  = new BufferedReader(inputStreamReader);
	
	// Creating JSON File From Response Content 
	var responseStrBuilder = new StringBuilder();
	var line=null;
	while ((line = bufferedReader.readLine()) != null) {
		responseStrBuilder.append(line);
	}
	var jsonObject = new JSONObject(responseStrBuilder.toString());
	System.out.println("JSON OBject => "+jsonObject);
	file = new File("D:\\"+fileName);
	var writer = new FileWriter(file);
	writer.write(jsonObject.toJSONString());
	writer.close();
	
	// Update WTDOC with New Primary Content
	var docAD = ApplicationData.newApplicationData(workingDocument);
	docAD.setFileName(file.getName());
	docAD.setUploadedFromPath("D:\\"+fileName);
	docAD.setRole(ContentRoleType.PRIMARY);
	var inputstream = new java.io.FileInputStream(file);
	ContentServerHelper.service.updateContent(workingDocument, docAD,inputstream);
	transaction.commit();
	transaction=null;
	inputstream.close();
	workingDocument = PersistenceHelper.manager.refresh(workingDocument);
	
	// CheckIn Document
	updatedDocument =  WorkInProgressHelper.service.checkin(workingDocument, "its Updated"); //latQueryDoc
	System.out.println("After Update getVersionInfo : "+updatedDocument.getVersionInfo().getIdentifier().getValue());
	System.out.println("After Update getIterationIdentifier : "+updatedDocument.getIterationIdentifier().getValue());
	updatedDocument = ContentHelper.service.getContents(updatedDocument);
	var ci = updatedDocument.getPrimary();
	System.out.println(" New ContentItem => "+ci);
	
	System.out.println("updatePrimaryContent Execution is over, Returning workingDocument WTDOC OBject with ID "+updatedDocument.getIdentity());
	
	// Returning WTDOC Object with Updated Primary Content
	return updatedDocument;
	
	
}
